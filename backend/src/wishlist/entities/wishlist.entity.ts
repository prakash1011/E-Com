import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Users } from 'src/components/user/user.entities';
import { Product } from 'src/product/product.entities';

@Entity()
@Unique(['user', 'product']) // ek user ke liye same product sirf ek baar wishlist me
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.wishlistItems, {
    onDelete: 'CASCADE',
  })
  user: Users;

  @ManyToOne(() => Product, {
    eager: true, // product details auto-load ho jayenge
    onDelete: 'CASCADE',
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
