import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../user/user.entities';

@Entity({ name: 'expert' })
export class Expert extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 200 })
  name!: string;

  @Column({ length: 20 })
  phoneNo!: string;

  @Column({ type: 'varchar', length: 500 })
  address!: string;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  notes?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  @OneToOne(() => Users, (user) => user.expert, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Users;
}
