import { Module } from '@nestjs/common';
import { EmailTokenService } from './emailToken.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [EmailTokenService],
  exports: [EmailTokenService],
})
export class EmailTokenModule {}
