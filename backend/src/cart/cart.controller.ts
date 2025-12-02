// src/cart/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':customerId')
  getCart(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.cartService.getCart(customerId);
  }

  @Post(':customerId/items')
  addToCart(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(customerId, dto);
  }

  @Put(':customerId/items/:itemId')
  updateItem(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(customerId, itemId, dto);
  }

  @Delete(':customerId/items/:itemId')
  removeItem(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(customerId, itemId);
  }

  @Delete(':customerId/clear')
  clearCart(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.cartService.clearCart(customerId);
  }
}
