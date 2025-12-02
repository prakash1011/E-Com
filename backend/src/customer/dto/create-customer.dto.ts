import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ example: 'Ajay', description: 'Name of the entity' })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(6, 100)
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
    format: 'email',
  })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @ApiProperty({
    example: 'jhjgdskjadsgdjhgdaskjhgds',
    description: 'Password (will be hashed)',
  })
  readonly password: string;
}
