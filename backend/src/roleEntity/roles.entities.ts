import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../components/user/user.entities';

@Entity()
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index({ unique: true })
  @Column()
  roleName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    //we could have named this normalize func anything it automatically gets called before insert and before update
    this.roleName = this.roleName.trim().toLowerCase();
  }

  @OneToMany(() => Users, (user) => user.roles)
  users: Users[];
}
