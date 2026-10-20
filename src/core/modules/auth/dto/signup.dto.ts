import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SignupDto {
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  @IsString({ message: 'الاسم يجب أن يكون نصاً' })
  name: string;

  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email: string;

  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'الدور الوظيفي مطلوب' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsEnum(['DOCTOR', 'RECEPTIONIST', 'ASSISTANT'], {
    message:
      'الدور الوظيفي غير صالح، يجب أن يكون DOCTOR أو RECEPTIONIST أو ASSISTANT',
  })
  role: string;

  @IsOptional()
  @IsString({ message: 'التخصص يجب أن يكون نصاً' })
  specialization?: string;

  @IsOptional()
  @IsString({ message: 'مسار أو اسم الصورة يجب أن يكون نصاً' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'مسار أو اسم الصورة الرمزية يجب أن يكون نصاً' })
  avatar?: string;
}
