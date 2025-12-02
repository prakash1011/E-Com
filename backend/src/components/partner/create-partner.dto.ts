import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNo: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
