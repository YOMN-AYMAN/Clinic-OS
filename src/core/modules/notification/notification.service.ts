import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../models/notification.model';
import { ClinicSettingsService } from '../settings/settings.service';
import { ServiceType } from '../../enums';
import axios from 'axios';

@Injectable()
export class NotificationService {
  private idInstance = '710722791081';
  private apiTokenInstance =
    '8a3c4616ffcf42bda011dd18584435ae74c1f77b557541b095';

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private clinicSettingsService: ClinicSettingsService,
  ) {}

  async sendAppointmentNotification(
    patientId: string,
    appointmentId: string,
    serviceType: string,
    patientName: string,
    patientPhone: string,
    date: string,
    time: string,
  ): Promise<void> {
    const settings = await this.clinicSettingsService.getSettings();
    const clinicName = settings.clinicName || 'عيادتنا';

    let message = '';
    switch (serviceType) {
      case ServiceType.NEW_EXAM:
        message = `مرحباً ${patientName}، تم حجز موعد لكشف جديد في يوم ${date} في تمام الساعة ${time}. يرجى التواجد في مقر العيادة قبل الموعد المحدد بربع ساعة. نتمنى لك الشفاء العاجل. شكراً لاختيارك ${clinicName}.`;
        break;
      case ServiceType.CONSULTATION:
        message = `مرحباً ${patientName}، تم حجز موعد استشارة طبية في يوم ${date} في تمام الساعة ${time}. يرجى الحضور قبل الموعد بربع ساعة. مع تمنياتنا لك بدوام الصحة - ${clinicName}.`;
        break;
      case ServiceType.RE_EXAM:
        message = `مرحباً ${patientName}، تم تأكيد موعد إعادة الكشف في يوم ${date} في تمام الساعة ${time}. نتمنى لك دوام الصحة - ${clinicName}.`;
        break;
      case ServiceType.FOLLOW_UP:
        message = `مرحباً ${patientName}، تذكير بموعد المتابعة الخاص بك في يوم ${date} في تمام الساعة ${time} - ${clinicName}.`;
        break;
      default:
        message = `مرحباً ${patientName}، تم حجز موعدك في يوم ${date} في تمام الساعة ${time} - ${clinicName}.`;
        break;
    }

    const newNotification = new this.notificationModel({
      patientId: new Types.ObjectId(patientId),
      appointmentId: new Types.ObjectId(appointmentId),
      type: serviceType,
      message,
    });
    await newNotification.save();

    try {
      const chatId = `${patientPhone.replace('+', '')}@c.us`;
      const url = `https://api.green-api.com/waInstance${this.idInstance}/sendMessage/${this.apiTokenInstance}`;

      const response = await axios.post(url, {
        chatId: chatId,
        message: message,
      });

      console.log('تم إرسال رسالة الواتساب بنجاح:', response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'فشل إرسال رسالة الواتساب:',
          (error.response?.data as unknown) || error.message,
        );
      } else {
        console.error('فشل إرسال رسالة الواتساب:', error);
      }
    }
  }
}
