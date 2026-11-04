import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../models/notification.model';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  @Get('patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async getPatientNotifications(@Param('patientId') patientId: string) {
    return this.notificationModel
      .find({ patientId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
