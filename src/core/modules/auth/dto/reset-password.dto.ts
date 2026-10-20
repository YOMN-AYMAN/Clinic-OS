import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @IsNotEmpty({ message: 'كود التحقق مطلوب' })
  @IsString()
  @Length(6, 6, { message: 'كود التحقق يجب أن يكون مكوناً من 6 أرقام' })
  otp: string;

  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف' })
  @IsString()
  newPassword: string;
}
