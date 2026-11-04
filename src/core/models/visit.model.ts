import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VisitStatus } from '../enums';

export type VisitDocument = Visit & Document;

@Schema({ timestamps: true })
export class Visit {
  @Prop({
    type: Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true,
  })
  appointmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  visitDate: Date;

  @Prop({ trim: true })
  chiefComplaint: string;

  @Prop({ trim: true })
  presentIllness: string;

  @Prop({ required: true, trim: true })
  diagnosis: string;

  @Prop({
    type: {
      height: { type: Number },
      weight: { type: Number },
      bloodPressure: { type: String },
      temperature: { type: Number },
      pulse: { type: Number },
    },
    _id: false,
  })
  vitals?: {
    height?: number;
    weight?: number;
    bloodPressure?: string;
    temperature?: number;
    pulse?: number;
  };

  @Prop({
    required: true,
    enum: Object.values(VisitStatus),
    default: VisitStatus.IN_PROGRESS,
  })
  status: VisitStatus;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
