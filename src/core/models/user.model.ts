import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: ['DOCTOR', 'RECEPTIONIST', 'ASSISTANT'],
  })
  role: string;

  @Prop()
  photo: string;

  @Prop({
    required: function (this: UserDocument) {
      return this.role === 'DOCTOR';
    },
  })
  specialization?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
