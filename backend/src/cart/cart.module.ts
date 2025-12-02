import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Product } from '../product/product.entities';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Users } from 'src/components/user/user.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, Users])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
