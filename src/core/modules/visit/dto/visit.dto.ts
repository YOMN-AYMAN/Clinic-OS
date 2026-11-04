import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsMongoId,
  IsDateString,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { VisitStatus } from '../../../enums';

export class CreateVisitDto {
  @IsNotEmpty({ message: 'معرف الموعد مطلوب' })
  @IsMongoId({ message: 'معرف الموعد غير صالح' })
  appointmentId: string;

  @IsNotEmpty({ message: 'معرف المريض مطلوب' })
  @IsMongoId({ message: 'معرف المريض غير صالح' })
  patientId: string;

  @IsNotEmpty({ message: 'معرف الطبيب مطلوب' })
  @IsMongoId({ message: 'معرف الطبيب غير صالح' })
  doctorId: string;

  @IsNotEmpty({ message: 'تاريخ وزيارة الكشف مطلوب' })
  @IsDateString({}, { message: 'صيغة تاريخ الزيارة غير صحيحة' })
  visitDate: string;

  @IsOptional()
  @IsString({ message: 'الشكوى الرئيسية يجب أن تكون نصاً' })
  chiefComplaint?: string;

  @IsOptional()
  @IsString({ message: 'تاريخ المرض الحالي يجب أن يكون نصاً' })
  presentIllness?: string;

  @IsNotEmpty({ message: 'التشخيص مطلوب' })
  @IsString({ message: 'التشخيص يجب أن يكون نصاً' })
  diagnosis: string;

  @IsOptional()
  @IsObject({ message: 'العلامات الحيوية يجب أن تكون كائن بيانات' })
  vitals?: {
    height?: number;
    weight?: number;
    bloodPressure?: string;
    temperature?: number;
    pulse?: number;
  };

  @IsOptional()
  @IsEnum(VisitStatus, { message: 'حالة الكشف غير صالحة' })
  @Transform(({ value }: { value: string }) =>
    value ? (value.trim() as VisitStatus) : VisitStatus.IN_PROGRESS,
  )
  status?: VisitStatus;
}

export class UpdateVisitDto extends PartialType(CreateVisitDto) {}
