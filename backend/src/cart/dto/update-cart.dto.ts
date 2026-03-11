import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity?: number;
}
