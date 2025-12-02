import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './deliveries.entities';
import { Product } from 'src/product/product.entities';
import { Partner } from 'src/components/partner/partner.entities';
import { Users } from 'src/components/user/user.entities';

@Module({
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  imports: [TypeOrmModule.forFeature([Delivery, Product, Partner, Users])],
})
export class DeliveriesModule {}
