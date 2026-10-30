import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Appointment, AppointmentSchema } from '../../models/appointment.model';
import { AppointmentController } from './appoientment.controller';
import { AppointmentService } from './appoientment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
