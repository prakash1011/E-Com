import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/user.entities';
import { Partner } from './partner.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Partner])],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
