import { IsArray, ArrayUnique, IsInt, Min } from 'class-validator';

export class SyncWishlistDto {
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  productIds: number[];
}
