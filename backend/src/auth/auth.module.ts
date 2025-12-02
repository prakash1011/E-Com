import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Users } from 'src/components/user/user.entities';
import { Roles } from 'src/roleEntity/roles.entities';
import { Customer } from 'src/customer/entity/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles, Customer]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secretkey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
