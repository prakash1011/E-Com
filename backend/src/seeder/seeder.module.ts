import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { Users } from 'src/components/user/user.entities';
import { Roles } from 'src/roleEntity/roles.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles])],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
