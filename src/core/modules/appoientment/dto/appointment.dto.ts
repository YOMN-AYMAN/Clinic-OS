import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { AppointmentStatus, ServiceType } from '../../../enums';

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
  @IsEnum(ServiceType, {
    message: 'نوع الخدمة غير صالح',
  })
  @Transform(({ value }: { value: string }) => value?.trim())
  serviceType: string;

  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'حالة الموعد غير صالحة',
  })
  @Transform(({ value }: { value: string }) =>
    value ? value.trim() : AppointmentStatus.PENDING,
  )
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
