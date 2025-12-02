import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  InternalServerErrorException,
} from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seed')
export class SeederController {
  constructor(private readonly settingService: SeederService) {}

  @Post(':secret')
  async dataBaseSeeder(@Param('secret') secret: string) {
    try { 
      if (secret && secret?.toLowerCase() === process.env.SEED_SECRET) {
        return await this.settingService.dataBaseSeeder();
      }
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      throw new InternalServerErrorException('Seeding failed');
    }
  }
}
