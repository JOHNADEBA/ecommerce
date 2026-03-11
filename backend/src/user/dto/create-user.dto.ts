import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../../generated/prisma/enums.js';

export class CreateUserDto {
  @IsString()
  clerkId: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
