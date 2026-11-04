import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicSettingsController } from './settings.controller';
import { ClinicSettingsService } from './settings.service';
import {
  ClinicSettings,
  ClinicSettingsSchema,
} from '../../models/settings.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClinicSettings.name, schema: ClinicSettingsSchema },
    ]),
  ],
  controllers: [ClinicSettingsController],
  providers: [ClinicSettingsService],
  exports: [ClinicSettingsService],
})
export class SettingsModule {}
