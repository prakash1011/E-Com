import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/product.entities'; // adjust path if needed

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => Product, {
    eager: true, // automatically load product with cart item
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
