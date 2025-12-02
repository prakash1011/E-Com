import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entities';
import { Users } from 'src/components/user/user.entities';
import { Partner } from 'src/components/partner/partner.entities';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, Users, Partner])],
})
export class ProductModule {}
