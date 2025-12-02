import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ResetPasswordService } from './reset-password.service';

@Module({
  imports: [
    ConfigModule, 
    JwtModule.register({}), 
  ],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
