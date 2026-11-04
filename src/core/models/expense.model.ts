import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpenseType } from '../enums';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  @Prop({
    required: true,
    enum: Object.values(ExpenseType),
  })
  type: ExpenseType;

  @Prop({ trim: true })
  employeeName?: string;

  @Prop({ trim: true })
  jobTitle?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ trim: true })
  receivedBy?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
