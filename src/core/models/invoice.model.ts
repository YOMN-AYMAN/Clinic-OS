import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InvoiceStatus, PaymentMethod } from '../enums';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true,
  })
  appointmentId: Types.ObjectId;

  @Prop({
    type: [
      {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        qty: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
    required: true,
  })
  items: {
    name: string;
    price: number;
    qty: number;
  }[];

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({ required: true, min: 0, default: 0 })
  paidAmount: number;

  @Prop({
    required: true,
    enum: Object.values(InvoiceStatus),
    default: InvoiceStatus.UNPAID,
  })
  status: string;

  @Prop({
    type: [
      {
        amount: { type: Number, required: true, min: 0 },
        method: {
          type: String,
          enum: Object.values(PaymentMethod),
          required: true,
        },
        paidAt: { type: Date, default: Date.now },
        receivedBy: { type: String, required: true, trim: true },
      },
    ],
    default: [],
  })
  payments: {
    amount: number;
    method: string;
    paidAt: Date;
    receivedBy: string;
  }[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
