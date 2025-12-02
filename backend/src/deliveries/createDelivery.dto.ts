import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateDeliveryDto {
  @IsOptional()
  @IsNumber()
  assignedPartnerId?: number | null;

  @IsNumber()
  productId!: number;

  @IsString()
  @IsNotEmpty()
  pickupAddress!: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress!: string;

  @IsDateString()
  pickupDate!: string; // Angular should send ISO string (e.g. new Date().toISOString())

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  sender?: any | null;

  @IsOptional()
  receiver?: any | null;
}
