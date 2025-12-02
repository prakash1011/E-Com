import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Users } from './user.entities';
import { EmailService } from 'src/components/email/email.service';
import { ConfigModule } from '@nestjs/config';
import { ResetPasswordModule } from 'src/components/reset-password/reset-password.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule,
    ResetPasswordModule,
  ],
  controllers: [UserController],
  providers: [UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
