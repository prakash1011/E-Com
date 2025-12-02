import { PartialType } from '@nestjs/mapped-types';
import { SyncWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(SyncWishlistDto) {}
