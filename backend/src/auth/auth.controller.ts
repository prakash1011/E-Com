import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    try {
      return await this.authService.login(req.user);
    } catch (error) {
      throw new InternalServerErrorException('Login failed');
    }
  }
}
