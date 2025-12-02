import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.userService.sendResetLink(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    return this.userService.resetPassword(token, newPassword);
  }

  @Get('users')
  async getAll(@Query('withDeleted') withDeleted?: string) {
    const includeDeleted = withDeleted === 'true';
    return this.userService.getAllUsers(includeDeleted);
  }
}
