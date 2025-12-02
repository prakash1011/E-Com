import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Partner } from '../partner/partner.entities';
import { Expert } from '../expert/expert.entities';
import { Roles } from 'src/roleEntity/roles.entities';
import * as bcrypt from 'bcrypt';
import { Delivery } from 'src/deliveries/deliveries.entities';
import { Cart } from 'src/cart/entities/cart.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({
    select: false,
    type: 'varchar',
    length: 255,
  })
  password!: string;

  @Column({ type: 'int', default: 1 })
  active!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  @ManyToOne(() => Roles, (r) => r.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  roles!: Roles;

  @OneToOne(() => Partner, (partner) => partner.user)
  partner?: Partner | null;

  @OneToOne(() => Expert, (expert) => expert.user)
  expert?: Expert | null;

  @OneToOne(() => Cart, (cart) => cart.customer)
  cart?: Cart;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToMany(() => Delivery, (delivery) => delivery.createdBy)
  createdDeliveries?: Delivery[];

  @OneToMany(() => Wishlist, (wish) => wish.user)
  wishlistItems?: Wishlist[];
}
