import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { UpdateUserDto } from '../user/update-user.dto';
import { CreateExpertDto } from './create-expert.dto';

export class UpdateUserWithExpertDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateExpertDto)
  expert?: CreateExpertDto;
}
