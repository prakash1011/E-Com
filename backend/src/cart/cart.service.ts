// src/cart/cart.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Product } from '../product/product.entities';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { Users } from 'src/components/user/user.entities';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}

  private async getOrCreateCart(customerId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { customer: { id: customerId } },
      relations: ['items', 'items.product', 'customer'],
    });

    if (!cart) {
      const customer = await this.usersRepo.findOne({
        where: { id: customerId },
        relations: ['roles'],
      });
      if (!customer) throw new NotFoundException('Customer (user) not found');

      if (!customer.roles || customer.roles.roleName !== 'customer') {
        throw new BadRequestException('User is not a customer');
      }

      cart = this.cartRepo.create({ customer, items: [] });
      cart = await this.cartRepo.save(cart);
    }
    return cart;
  }

  async getCart(customerId: number) {
    const cart = await this.cartRepo.findOne({
      where: { customer: { id: customerId } },
      relations: ['items', 'items.product', 'customer'],
    });
    if (!cart) {
      return { id: null, items: [] };
    }
    return cart;
  }

  async addToCart(customerId: number, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(customerId);

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const quantity = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;

    let item = cart.items.find((i) => i.product.id === product.id);
    if (item) {
      item.quantity += quantity;
      await this.cartItemRepo.save(item);
    } else {
      item = this.cartItemRepo.create({
        cart,
        product,
        quantity,
      });
      await this.cartItemRepo.save(item);
    }

    return this.getCart(customerId);
  }

  async updateItem(customerId: number, itemId: number, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(customerId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    item.quantity = dto.quantity;
    if (item.quantity <= 0) {
      await this.cartItemRepo.delete(item.id);
    } else {
      await this.cartItemRepo.save(item);
    }
    return this.getCart(customerId);
  }

  async removeItem(customerId: number, itemId: number) {
    const cart = await this.getOrCreateCart(customerId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    await this.cartItemRepo.delete(item.id);
    return this.getCart(customerId);
  }

  async clearCart(customerId: number) {
    const cart = await this.cartRepo.findOne({
      where: { customer: { id: customerId } },
      relations: ['items'],
    });
    if (!cart) return { message: 'Cart already empty' };

    await this.cartItemRepo.delete({ cart: { id: cart.id } as any });
    return { message: 'Cart cleared' };
  }
}
