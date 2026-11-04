import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'اسم الخدمة مطلوب' })
  @IsString({ message: 'اسم الخدمة يجب أن يكون نصاً' })
  name: string;

  @IsNotEmpty({ message: 'سعر الخدمة مطلوب' })
  @IsNumber({}, { message: 'سعر الخدمة يجب أن يكون رقماً' })
  @Min(0, { message: 'سعر الخدمة لا يمكن أن يكون سالباً' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'مدة الخدمة يجب أن تكون رقماً' })
  @Min(5, { message: 'أقل مدة للخدمة هي 5 دقائق' })
  durationMinutes?: number;

  @IsOptional()
  @IsBoolean({ message: 'حالة التفعيل يجب أن تكون حقيقية أو خاطئة' })
  isActive?: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
