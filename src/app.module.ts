import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/modules/auth/auth.module';
import { PatientModule } from './core/modules/patient/patient.module';
import { AppointmentModule } from './core/modules/appoientment/appoientment.module';
import { VisitModule } from './core/modules/visit/visit.module';
import { PrescriptionModule } from './core/modules/prescription/prescription.module';
import { InvoiceModule } from './core/modules/invoice/invoice.module';
import { ExpenseModule } from './core/modules/expense/expense.module';
import { ReportsModule } from './core/modules/report/report.module';
import { ServiceModule } from './core/modules/service/service.module';
import { NotificationModule } from './core/modules/notification/notification.module';
import { SettingsModule } from './core/modules/settings/settings.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/clinicos'),
    AuthModule,
    PatientModule,
    AppointmentModule,
    VisitModule,
    PrescriptionModule,
    InvoiceModule,
    ExpenseModule,
    ReportsModule,
    ServiceModule,
    NotificationModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
