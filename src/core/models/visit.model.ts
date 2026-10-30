import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
  chiefComplaint: string; // الشكوى الرئيسية

  @Prop({ trim: true })
  presentIllness: string; // المرض الحالي

  @Prop({ required: true, trim: true })
  diagnosis: string; // التشخيص

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
    enum: ['IN_PROGRESS', 'COMPLETED'],
    default: 'IN_PROGRESS',
  })
  status: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
