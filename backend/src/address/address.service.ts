import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { PRISMA_CLIENT } from '../lib/prisma.module.js';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class AddressesService {
  constructor(@Inject(PRISMA_CLIENT) private prisma: PrismaClient) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    // If this is the first address or marked as default, handle default logic
    const existingAddresses = await this.prisma.address.count({
      where: { userId },
    });

    const isDefault =
      existingAddresses === 0 ? true : createAddressDto.isDefault || false;

    // If this address is default, remove default from others
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        isDefault,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async update(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    await this.findOne(userId, addressId);

    // Handle default address logic
    if (updateAddressDto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: updateAddressDto,
    });
  }

  async remove(userId: string, addressId: string) {
    const address = await this.findOne(userId, addressId);

    // Don't allow deletion of default address if there are other addresses
    if (address.isDefault) {
      const otherAddresses = await this.prisma.address.count({
        where: { userId, id: { not: addressId } },
      });

      if (otherAddresses > 0) {
        // Make another address default
        const nextAddress = await this.prisma.address.findFirst({
          where: { userId, id: { not: addressId } },
          orderBy: { createdAt: 'desc' },
        });

        if (nextAddress) {
          await this.prisma.address.update({
            where: { id: nextAddress.id },
            data: { isDefault: true },
          });
        }
      }
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { success: true };
  }

  async setDefault(userId: string, addressId: string) {
    await this.findOne(userId, addressId);

    // Remove default from all addresses
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
