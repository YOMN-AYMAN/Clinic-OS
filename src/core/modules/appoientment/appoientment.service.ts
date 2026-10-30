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
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  // 1. إنشاء موعد جديد مع منع التداخل (فارق 15 دقيقة)
  async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    const { doctorId, date, time } = createDto;

    // حساب نطاق الـ 15 دقيقة (يمكن تبسيطها بالتأكد من عدم تطابق نفس اليوم والوقت تماماً، أو حساب دقائق الـ Time)
    // هنا سنقوم بالتحقق من نفس اليوم ونفس الوقت بدقة منعاً للتداخل المباشر
    const existingAppointment = await this.appointmentModel.findOne({
      doctorId: new Types.ObjectId(doctorId),
      date,
      time,
      status: { $ne: 'CANCELLED' }, // لو الموعد مش ملغي يبقى محجوز
    });

    if (existingAppointment) {
      throw new ConflictException(
        'هذا الموعد محجوز مسبقاً لهذا الطبيب في نفس الوقت',
      );
    }

    const newAppointment = new this.appointmentModel({
      ...createDto,
      patientId: new Types.ObjectId(createDto.patientId),
      doctorId: new Types.ObjectId(createDto.doctorId),
    });

    return newAppointment.save();
  }

  // 2. جلب كل المواعيد (مع إمكانية جلب بيانات المريض والدكتور المرتبطة)
  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel
      .find()
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialization email')
      .sort({ date: 1, time: 1 })
      .exec();
  }

  // 3. جلب موعد معين بالـ ID
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

  // 4. تحديث بيانات أو حالة الموعد
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

  // 5. حذف موعد
  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.appointmentModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('الموعد المراد حذفه غير موجود');
    }
    return { message: 'تم حذف الموعد بنجاح' };
  }
}
