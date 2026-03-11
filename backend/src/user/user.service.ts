import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PRISMA_CLIENT } from '../lib/prisma.module.js';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(@Inject(PRISMA_CLIENT) private prisma: PrismaClient) {}

  async syncUser(createUserDto: CreateUserDto) {
    try {
      // Try to find existing user
      let user = await this.prisma.user.findUnique({
        where: { clerkId: createUserDto.clerkId },
        include: { cart: true },
      });

      if (user) {
        // Update existing user
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            email: createUserDto.email,
            name: createUserDto.name,
          },
          include: { cart: true },
        });
      } else {
        // Create new user with cart
        user = await this.prisma.user.create({
          data: {
            clerkId: createUserDto.clerkId,
            email: createUserDto.email,
            name: createUserDto.name,
            cart: {
              create: {},
            },
          },
          include: { cart: true },
        });
      }

      return user;
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        orders: true,
        addresses: true,
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
        addresses: true,
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByClerkId(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: {
        orders: true,
        addresses: true,
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with Clerk ID ${clerkId} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        cart: true,
        addresses: true,
        orders: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // This will cascade delete cart, addresses, orders due to schema relations
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
