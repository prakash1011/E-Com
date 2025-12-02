import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  assignedPartnerId?: number;
}
