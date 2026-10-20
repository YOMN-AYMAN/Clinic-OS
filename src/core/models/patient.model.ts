import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  medicalHistory?: string; // التاريخ المرضي أو الأمراض المزمنة

  @Prop({ trim: true })
  allergies?: string; // الحساسية تجاه أدوية معينة

  @Prop({ trim: true })
  photo?: string; // مسار أو اسم صورة المريض

  @Prop({ trim: true })
  documents?: string; // مسار أو اسم المستند/التقرير الطبي
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
