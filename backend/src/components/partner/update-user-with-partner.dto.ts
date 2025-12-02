import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { UpdateUserDto } from '../user/update-user.dto';
import { CreatePartnerDto } from './create-partner.dto';

export class UpdateUserWithPartnerDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePartnerDto)
  partner?: CreatePartnerDto;
}
