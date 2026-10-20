import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @IsNotEmpty({ message: 'كود التحقق مطلوب' })
  @IsString()
  @Length(6, 6, { message: 'كود التحقق يجب أن يكون مكوناً من 6 أرقام' })
  otp: string;
}
