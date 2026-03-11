import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch, 
  Delete,
  UseGuards 
} from '@nestjs/common';
import { UsersService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { AuthGuard } from '../common/guards/auth-combined.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // This endpoint will be called from frontend after Clerk login
  @Post('sync')
  async syncUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.syncUser(createUserDto);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('clerk/:clerkId')
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  async findByClerkId(@Param('clerkId') clerkId: string) {
    return this.usersService.findByClerkId(clerkId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}