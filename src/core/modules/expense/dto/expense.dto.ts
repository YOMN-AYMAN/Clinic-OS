import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { ExpenseType } from '../../../enums';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'نوع المصروف مطلوب' })
  @IsEnum(ExpenseType, {
    message: 'نوع المصروف يجب أن يكون راتب أو مشتريات',
  })
  @Transform(({ value }: { value: string }) => (value ? value.trim() : ''))
  type: ExpenseType;

  @IsOptional()
  @IsString({ message: 'اسم الموظف يجب أن يكون نصاً' })
  employeeName?: string;

  @IsOptional()
  @IsString({ message: 'الوظيفة يجب أن تكون نصاً' })
  jobTitle?: string;

  @IsOptional()
  @IsString({ message: 'وصف المشتريات يجب أن يكون نصاً' })
  description?: string;

  @IsNotEmpty({ message: 'المبلغ مطلوب' })
  @IsNumber({}, { message: 'المبلغ يجب أن يكون رقماً' })
  @Min(0, { message: 'المبلغ لا يمكن أن يكون سالباً' })
  amount: number;

  @IsOptional()
  @IsString({ message: 'اسم المستلم يجب أن يكون نصاً' })
  receivedBy?: string;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
