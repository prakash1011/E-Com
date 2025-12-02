import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Users } from 'src/components/user/user.entities';
import { Partner } from 'src/components/partner/partner.entities';
import { Delivery } from 'src/deliveries/deliveries.entities';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Users, { nullable: false, eager: true })
  @JoinColumn({ name: 'createdById' })
  createdBy!: Users;

  @ManyToOne(() => Partner, (partner) => partner.products, { nullable: true })
  @JoinColumn({ name: 'assignedPartnerId' })
  assignedPartner?: Partner | null;

  @OneToMany(() => Delivery, (delivery) => delivery.product)
  deliveries?: Delivery[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
