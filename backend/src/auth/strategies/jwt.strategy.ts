import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'secretkey',
    });
  }

  async validate(payload: any) {
    // payload expected: { id, email, role, iat, exp }
    if (!payload?.id || !payload?.email) {
      throw new UnauthorizedException('Invalid token');
    }
    // Whatever you return becomes req.user
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
