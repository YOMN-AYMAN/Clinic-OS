import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString()
  password: string;
}
