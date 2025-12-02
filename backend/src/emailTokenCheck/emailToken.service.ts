import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/components/user/user.entities';

@Injectable()
export class EmailTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateResetToken(user: Users): Promise<string> {
    const resetToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        secret: this.configService.get<string>('JWT_RESET_SECRET'),
        expiresIn: '15m',
      },
    );
    return resetToken;
  }

  async validateResetToken(token: string): Promise<number> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_RESET_SECRET'),
      });
      return decoded.id;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(
          'The reset token has expired. Please request a new one.',
        );
      }
      throw new BadRequestException('Invalid or malformed reset token.');
    }
  }
}
