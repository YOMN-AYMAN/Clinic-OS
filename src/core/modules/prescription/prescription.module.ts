import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescriptionController } from './prescription.controller';
import { PrescriptionService } from './prescription.service';
import {
  Prescription,
  PrescriptionSchema,
} from '../../models/prescription.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
})
export class PrescriptionModule {}
