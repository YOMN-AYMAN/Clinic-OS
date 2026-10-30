import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/modules/auth/auth.module';
import { PatientModule } from './core/modules/patient/patient.module';
import { AppointmentModule } from './core/modules/appoientment/appoientment.module';
import { VisitModule } from './core/modules/visit/visit.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/clinicos'),
    AuthModule,
    PatientModule,
    AppointmentModule,
    VisitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
