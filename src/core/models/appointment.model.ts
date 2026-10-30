import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  date: string; // صيغة التاريخ مثلاً: 'YYYY-MM-DD'

  @Prop({ required: true })
  time: string; // صيغة الوقت مثلاً: '10:30'

  @Prop({
    required: true,
    enum: ['CONSULTATION', 'NEW_EXAM', 'FOLLOW_UP', 'RE_EXAM'],
    default: 'CONSULTATION',
  })
  serviceType: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ trim: true })
  notes?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
