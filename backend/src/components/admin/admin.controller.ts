import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin')
export class AdminController {
  @Get('dashboard')
  @Roles('admin')
  async getAdminDashboard() {
    return { message: 'Welcome Admin' };
  }
}
