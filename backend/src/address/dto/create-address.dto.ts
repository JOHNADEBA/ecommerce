import { IsString, IsOptional, IsBoolean, IsPostalCode } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  fullName: string;

  @IsString()
  addressLine: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  @IsPostalCode('any')
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
