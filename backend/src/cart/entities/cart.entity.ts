// src/cart/cart.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Users } from 'src/components/user/user.entities';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Users;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



