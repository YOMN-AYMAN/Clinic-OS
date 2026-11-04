import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClinicSettingsDocument = ClinicSettings & Document;

@Schema({ timestamps: true })
export class ClinicSettings {
  @Prop({ required: true, trim: true, default: 'عيادة الشفاء' })
  clinicName: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  email?: string;

  @Prop({ trim: true })
  workingHours?: string;
}

export const ClinicSettingsSchema =
  SchemaFactory.createForClass(ClinicSettings);
