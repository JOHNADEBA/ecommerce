import { Module } from '@nestjs/common';
import { UsersService } from './user.service.js';
import { UserController } from './user.controller.js';

@Module({
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
