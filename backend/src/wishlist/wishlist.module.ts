import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Users } from 'src/components/user/user.entities';
import { Product } from 'src/product/product.entities';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Users, Product])],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService],
})
export class WishlistModule {}
