import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './address.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { AuthGuard } from '../common/guards/auth-combined.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('users/:userId/addresses')
@UseGuards(AuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(
    @Param('userId') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.create(userId, createAddressDto);
  }

  @Get()
  async findAll(@Param('userId') userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Get(':addressId')
  async findOne(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.addressesService.findOne(userId, addressId);
  }

  @Patch(':addressId')
  async update(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(userId, addressId, updateAddressDto);
  }

  @Patch(':addressId/default')
  async setDefault(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.addressesService.setDefault(userId, addressId);
  }

  @Delete(':addressId')
  async remove(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.addressesService.remove(userId, addressId);
  }
  // Admin routes
  @Get('admin/user/:userId')
  @Roles('ADMIN')
  async getAnyUserAddresses(@Param('userId') userId: string) {
    return this.addressesService.findAll(userId);
  }
}
