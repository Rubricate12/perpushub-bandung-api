// src/users/dto/create-address.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  label: string;         

  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}