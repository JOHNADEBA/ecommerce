import { Module } from '@nestjs/common';
import { AddressesService } from './address.service.js';
import { AddressesController } from './address.controller.js';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressModule {}
