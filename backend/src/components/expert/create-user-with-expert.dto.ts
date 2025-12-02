import { Type } from 'class-transformer';
import { ValidateNested, IsObject } from 'class-validator';
import { CreateUserDto } from '../user/create-user.dto';
import { CreateExpertDto } from './create-expert.dto';

export class CreateUserWithExpertDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateExpertDto)
  expert: CreateExpertDto;
}
