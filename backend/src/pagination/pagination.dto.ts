import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)//because url data is string it will convert it to number we can also to implicit type conversion
  page: number;
}
