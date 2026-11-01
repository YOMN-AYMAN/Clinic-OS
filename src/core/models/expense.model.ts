import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpenseType } from '../enums';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  @Prop({
    required: true,
    enum: Object.values(ExpenseType), // نوع المصروف: راتب أو مشتريات
  })
  type: ExpenseType;

  // خاصة بالرواتب (SALARY)
  @Prop({ trim: true })
  employeeName?: string;

  @Prop({ trim: true })
  jobTitle?: string;

  // خاصة بالمشتريات ومصروفات العيادة (PURCHASE)
  @Prop({ trim: true })
  description?: string; // وصف الطلب أو المشتريات

  @Prop({ required: true, min: 0 })
  amount: number; // القيمة أو الراتب

  @Prop({ trim: true })
  receivedBy?: string; // اسم المستلم أو المسؤول
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
