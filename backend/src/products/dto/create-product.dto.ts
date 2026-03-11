import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  MaxLength,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];

  @IsString()
  categoryId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  inventory: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (Array.isArray(value)) value = value[0];
    return value === true || value === 'true' || value === 'on';
  })
  isFeatured?: boolean;
}
