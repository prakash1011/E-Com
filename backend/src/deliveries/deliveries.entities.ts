import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Partner } from 'src/components/partner/partner.entities';
import { Product } from 'src/product/product.entities';
import { Users } from 'src/components/user/user.entities';

@Entity({ name: 'delivery' })
export class Delivery {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Partner, { nullable: true })
  assignedPartner?: Partner | null;

  @ManyToOne(() => Product, { nullable: false })
  product!: Product;

  @Column({ type: 'text', nullable: false })
  pickupAddress!: string;

  @Column({ type: 'text', nullable: false })
  deliveryAddress!: string;

  @Column({ type: 'timestamp', nullable: false })
  pickupDate!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredDate?: Date | null;

  @Column({ type: 'int', nullable: true })
  deliveryTime?: number | null;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ type: 'json', nullable: true })
  sender?: any | null;

  @Column({ type: 'json', nullable: true })
  receiver?: any | null;

  @Column({ type: 'text', nullable: true })
  failureReason?: string | null;

  @ManyToOne(() => Users, { nullable: true })
  createdBy?: Users | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
