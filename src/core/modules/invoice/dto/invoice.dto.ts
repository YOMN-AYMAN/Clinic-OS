import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsMongoId,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { PaymentMethod } from '../../../enums';

class InvoiceItemDto {
  @IsNotEmpty({ message: 'اسم الخدمة أو البند مطلوب' })
  @IsString({ message: 'اسم البند يجب أن يكون نصاً' })
  name: string;

  @IsNotEmpty({ message: 'سعر البند مطلوب' })
  @IsNumber({}, { message: 'السعر يجب أن يكون رقماً' })
  @Min(0, { message: 'السعر لا يمكن أن يكون سالباً' })
  price: number;

  @IsNotEmpty({ message: 'الكمية مطلوبة' })
  @IsNumber({}, { message: 'الكمية يجب أن تكون رقماً' })
  @Min(1, { message: 'الكمية يجب أن تكون 1 على الأقل' })
  qty: number;
}

export class CreateInvoiceDto {
  @IsNotEmpty({ message: 'معرف المريض مطلوب' })
  @IsMongoId({ message: 'معرف المريض غير صالح' })
  patientId: string;

  @IsNotEmpty({ message: 'معرف الموعد مطلوب' })
  @IsMongoId({ message: 'معرف الموعد غير صالح' })
  appointmentId: string;

  @IsArray({ message: 'بنود الفاتورة يجب أن تكون مصفوفة' })
  @ArrayMinSize(1, { message: 'يجب إضافة بند واحد على الأقل في الفاتورة' })
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsOptional()
  @IsNumber({}, { message: 'المبلغ المدفوع يجب أن يكون رقماً' })
  @Min(0, { message: 'المبلغ المدفوع لا يمكن أن يكون سالباً' })
  paidAmount?: number;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'طريقة الدفع غير صالحة' })
  @Transform(({ value }: { value: string }) =>
    value ? (value.trim() as PaymentMethod) : PaymentMethod.CASH,
  )
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString({ message: 'اسم المستلم يجب أن يكون نصاً' })
  receivedBy?: string;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

export class AddPaymentDto {
  @IsNotEmpty({ message: 'مبلغ الدفع مطلوب' })
  @IsNumber({}, { message: 'مبلغ الدفع يجب أن يكون رقماً' })
  @Min(1, { message: 'مبلغ الدفع يجب أن يكون اكبر من الصفر' })
  amount: number;

  @IsNotEmpty({ message: 'طريقة الدفع مطلوبة' })
  @IsEnum(PaymentMethod, { message: 'طريقة الدفع غير صالحة' })
  @Transform(({ value }: { value: string }) =>
    value ? (value.trim() as PaymentMethod) : PaymentMethod.CASH,
  )
  method: PaymentMethod;

  @IsNotEmpty({ message: 'اسم المستلم مطلوب' })
  @IsString({ message: 'اسم المستلم يجب أن يكون نصاً' })
  receivedBy: string;
}
