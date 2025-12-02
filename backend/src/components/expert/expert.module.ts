import { Module } from '@nestjs/common';
import { ExpertService } from './expert.service';
import { ExpertController } from './expert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/user.entities';
import { Expert } from './expert.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Expert])],
  controllers: [ExpertController],
  providers: [ExpertService],
})
export class ExpertModule {}
