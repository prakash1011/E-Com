// src/auth/auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/components/user/user.entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersRepo.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'active'], // include password
        relations: ['roles'],
      });
      console.log('User from DB =', user);
      console.log('Login attempt:', email, password);

      if (!user) return null;

      const storedHash = (user as any).password;
      if (!storedHash || typeof storedHash !== 'string') return null;

      const passCheck = await bcrypt.compare(password, storedHash);
      if (!passCheck) return null;

      const { password: _pw, ...safe } = user as any;
      return safe;
    } catch (error) {
      console.error('validateUser ERROR', error);
      throw new HttpException(
        `${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(user: any) {
    try {
      const payload = {
        id: user.id,
        email: user.email,
        role: user.roles?.roleName,
      };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token, user };
    } catch (error) {
      console.log('AuthService.login ERROR', error);
      throw new HttpException(
        `${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
