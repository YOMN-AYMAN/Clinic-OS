import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PrescriptionDocument = Prescription & Document;

@Schema({ timestamps: true })
export class Prescription {
  @Prop({ type: Types.ObjectId, ref: 'Visit', required: true, unique: true })
  visitId: Types.ObjectId;

  @Prop({
    type: [
      {
        medicineName: { type: String, required: true, trim: true },
        dose: { type: String, required: true, trim: true },
        frequency: { type: String, required: true, trim: true },
        duration: { type: String, required: true, trim: true },
        notes: { type: String, trim: true },
      },
    ],
    required: true,
  })
  items: {
    medicineName: string;
    dose: string;
    frequency: string;
    duration: string;
    notes?: string;
  }[];

  @Prop({ trim: true })
  notes?: string;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
