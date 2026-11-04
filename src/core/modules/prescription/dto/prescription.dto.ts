import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

class PrescriptionItemDto {
  @IsNotEmpty({ message: 'اسم الدواء مطلوب' })
  @IsString({ message: 'اسم الدواء يجب أن يكون نصاً' })
  medicineName: string;

  @IsNotEmpty({ message: 'الجرعة مطلوبة' })
  @IsString({ message: 'الجرعة يجب أن تكون نصاً' })
  dose: string;

  @IsNotEmpty({ message: 'تكرار الجرعة مطلوب' })
  @IsString({ message: 'تكرار الجرعة يجب أن يكون نصاً' })
  frequency: string;

  @IsNotEmpty({ message: 'مدة العلاج مطلوبة' })
  @IsString({ message: 'مدة العلاج يجب أن تكون نصاً' })
  duration: string;

  @IsOptional()
  @IsString({ message: 'ملاحظات الدواء يجب أن تكون نصاً' })
  notes?: string;
}

export class CreatePrescriptionDto {
  @IsNotEmpty({ message: 'معرف الكشف الطبي مطلوب' })
  @IsMongoId({ message: 'معرف الكشف الطبي غير صالح' })
  visitId: string;

  @IsArray({ message: 'قائمة الأدوية يجب أن تكون مصفوفة' })
  @ArrayMinSize(1, { message: 'يجب إضافة دواء واحد على الأقل في الروشتة' })
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];

  @IsOptional()
  @IsString({ message: 'الملاحظات العامة يجب أن تكون نصاً' })
  notes?: string;
}

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {}
