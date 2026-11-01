import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppointmentStatus, ServiceType } from '../enums';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({
    required: true,
    enum: Object.values(ServiceType),
    default: ServiceType.NEW_EXAM,
  })
  serviceType: string;

  @Prop({
    required: true,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.PENDING,
  })
  status: string;

  @Prop({ trim: true })
  notes?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
