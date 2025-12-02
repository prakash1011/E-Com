import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Users } from 'src/components/user/user.entities';
import { Roles } from 'src/roleEntity/roles.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
