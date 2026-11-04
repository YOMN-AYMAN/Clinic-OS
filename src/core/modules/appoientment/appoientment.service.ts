import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Appointment,
  AppointmentDocument,
} from '../../models/appointment.model';
import { Patient, PatientDocument } from '../../models/patient.model';
import { NotificationService } from '../notification/notification.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';
import { AppointmentStatus, ServiceType } from '../../enums';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Patient.name)
    private patientModel: Model<PatientDocument>,
    private notificationService: NotificationService,
  ) {}

  async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    const { doctorId, date, time, patientId, serviceType } = createDto;

    const existingAppointment = await this.appointmentModel.findOne({
      doctorId: new Types.ObjectId(doctorId),
      date,
      time,
      status: { $ne: AppointmentStatus.CANCELLED },
    });

    if (existingAppointment) {
      throw new ConflictException(
        'هذا الموعد محجوز مسبقاً لهذا الطبيب في نفس الوقت',
      );
    }

    const newAppointment = new this.appointmentModel({
      ...createDto,
      patientId: new Types.ObjectId(patientId),
      doctorId: new Types.ObjectId(doctorId),
    });
    const savedAppointment = await newAppointment.save();

    const patient = await this.patientModel.findById(patientId).exec();
    if (patient) {
      await this.notificationService.sendAppointmentNotification(
        patient._id.toString(),
        savedAppointment._id.toString(),
        serviceType || ServiceType.NEW_EXAM,
        patient.name,
        patient.phone,
        date,
        time,
      );
    }

    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel
      .find()
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialization email')
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async findById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialization')
      .exec();

    if (!appointment) {
      throw new NotFoundException('الموعد غير موجود');
    }
    return appointment;
  }

  async update(
    id: string,
    updateDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const updated = await this.appointmentModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('الموعد المراد تحديثه غير موجود');
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.appointmentModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('الموعد المراد حذفه غير موجود');
    }
    return { message: 'تم حذف الموعد بنجاح' };
  }
}
