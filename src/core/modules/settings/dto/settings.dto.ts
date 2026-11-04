import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateClinicSettingsDto {
  @IsString()
  @IsOptional()
  clinicName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  workingHours?: string;
}
