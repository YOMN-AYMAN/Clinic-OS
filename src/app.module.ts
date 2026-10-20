import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/modules/auth/auth.module';
import { PatientModule } from './core/modules/patient/patient.module';

@Module({
  imports: [
    // ربط MongoDB مباشرة بالرابط المحلي
    MongooseModule.forRoot('mongodb://localhost:27017/clinicos'),
    AuthModule,
    PatientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
