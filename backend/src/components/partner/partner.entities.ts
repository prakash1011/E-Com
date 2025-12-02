import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../user/user.entities';
import { Product } from 'src/product/product.entities';
import { Delivery } from 'src/deliveries/deliveries.entities';

@Entity({ name: 'partner' })
export class Partner extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 200 })
  name!: string;

  @Column({ length: 20 })
  phoneNo!: string;

  @Column({ type: 'text', nullable: true })
  address?: string | null;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  notes?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  @OneToOne(() => Users, (user) => user.partner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Users;

  @OneToMany(() => Product, (product) => product.assignedPartner)
  products!: Product[];

  @OneToMany(() => Delivery, (delivery) => delivery.assignedPartner)
  deliveries?: Delivery[];
}
