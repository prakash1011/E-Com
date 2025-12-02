import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RolesGuard } from 'src/guards/roles.guard';

@Module({
  controllers: [AdminController],
  providers: [RolesGuard],
})
export class AdminModule {}
