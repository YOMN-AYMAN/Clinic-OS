import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';


export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'معرف المريض مطلوب' })
  @IsMongoId({ message: 'معرف المريض غير صالح' })
  patientId: string;

  @IsNotEmpty({ message: 'معرف الطبيب مطلوب' })
  @IsMongoId({ message: 'معرف الطبيب غير صالح' })
  doctorId: string;

  @IsNotEmpty({ message: 'تاريخ الموعد مطلوب' })
  @IsString()
  date: string;

  @IsNotEmpty({ message: 'وقت الموعد مطلوب' })
  @IsString()
  time: string;

  @IsNotEmpty({ message: 'نوع الخدمة مطلوب' })
  @IsEnum(['CONSULTATION', 'NEW_EXAM', 'FOLLOW_UP', 'RE_EXAM'], {
    message: 'نوع الخدمة غير صالح',
  })
  @Transform(({ value }: { value: string }) => value?.trim().toUpperCase())
  serviceType: string;

  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'CANCELLED'], {
    message: 'حالة الموعد غير صالحة',
  })
  @Transform(({ value }: { value: string }) =>
    value ? value.trim().toUpperCase() : 'PENDING',
  )
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
