import { Type } from 'class-transformer';
import { ValidateNested, IsObject } from 'class-validator';
import { CreateUserDto } from '../user/create-user.dto';
import { CreatePartnerDto } from './create-partner.dto';

export class CreateUserWithPartnerDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreatePartnerDto)
  partner: CreatePartnerDto;
}
