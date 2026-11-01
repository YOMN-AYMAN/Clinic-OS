import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '../../../enums';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'اسم المريض مطلوب' })
  @IsString({ message: 'اسم المريض يجب أن يكون نصاً' })
  name: string;

  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  @IsString({ message: 'رقم الهاتف يجب أن يكون نصاً' })
  phone: string;

  @IsNotEmpty({ message: 'العمر مطلوب' })
  @Type(() => Number)
  @IsNumber({}, { message: 'العمر يجب أن يكون رقماً' })
  @Min(0, { message: 'العمر غير صالح' })
  @Max(120, { message: 'العمر غير صالح' })
  age: number;

  @IsNotEmpty({ message: 'النوع مطلوب' })
  @IsEnum(Gender, { message: 'النوع يجب أن يكون ذكر أو أنثى' })
  gender: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString({ message: 'مسار أو اسم صورة المريض يجب أن يكون نصاً' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'مسار أو اسم المستند يجب أن يكون نصاً' })
  documents?: string;
}

export class UpdatePatientDto {
  @IsOptional()
  @IsString({ message: 'اسم المريض يجب أن يكون نصاً' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'رقم الهاتف يجب أن يكون نصاً' })
  phone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'العمر يجب أن يكون رقماً' })
  @Min(0, { message: 'العمر غير صالح' })
  @Max(120, { message: 'العمر غير صالح' })
  age?: number;

  @IsOptional()
  @IsEnum(Gender, { message: 'النوع يجب أن يكون ذكر أو أنثى' })
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString({ message: 'مسار أو اسم صورة المريض يجب أن يكون نصاً' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'مسار أو اسم المستند يجب أن يكون نصاً' })
  documents?: string;
}
