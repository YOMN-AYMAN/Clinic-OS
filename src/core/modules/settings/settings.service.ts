import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ClinicSettings,
  ClinicSettingsDocument,
} from '../../models/settings.model';
import { UpdateClinicSettingsDto } from './dto/settings.dto';

@Injectable()
export class ClinicSettingsService {
  constructor(
    @InjectModel(ClinicSettings.name)
    private clinicSettingsModel: Model<ClinicSettingsDocument>,
  ) {}

  async getSettings(): Promise<ClinicSettings> {
    let settings = await this.clinicSettingsModel.findOne().exec();
    if (!settings) {
      settings = await this.clinicSettingsModel.create({
        clinicName: 'عيادة الشفاء',
        phone: '01000000000',
        address: 'المنصورة، مصر',
      });
    }
    return settings;
  }

  async updateSettings(
    updateDto: UpdateClinicSettingsDto,
  ): Promise<ClinicSettings> {
    let settings = await this.clinicSettingsModel.findOne().exec();

    if (!settings) {
      settings = new this.clinicSettingsModel(updateDto);
      return settings.save();
    }

    Object.assign(settings, updateDto);
    return settings.save();
  }
}
