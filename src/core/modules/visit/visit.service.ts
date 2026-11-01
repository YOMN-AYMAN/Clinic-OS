import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Visit, VisitDocument } from '../../models/visit.model';
import { CreateVisitDto, UpdateVisitDto } from './dto/visit.dto';

@Injectable()
export class VisitService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  async create(createDto: CreateVisitDto): Promise<Visit> {
    const existingVisit = await this.visitModel.findOne({
      appointmentId: new Types.ObjectId(createDto.appointmentId),
    });

    if (existingVisit) {
      throw new ConflictException('يوجد كشف طبي مسجل مسبقاً لهذا الموعد');
    }

    const newVisit = new this.visitModel({
      ...createDto,
      appointmentId: new Types.ObjectId(createDto.appointmentId),
      patientId: new Types.ObjectId(createDto.patientId),
      doctorId: new Types.ObjectId(createDto.doctorId),
      visitDate: new Date(createDto.visitDate),
    });

    return newVisit.save();
  }

  async findAll(): Promise<Visit[]> {
    return this.visitModel
      .find()
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialization')
      .populate('appointmentId', 'date time serviceType')
      .sort({ visitDate: -1 })
      .exec();
  }

  async findById(id: string): Promise<Visit> {
    const visit = await this.visitModel
      .findById(id)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialization')
      .populate('appointmentId', 'date time serviceType')
      .exec();

    if (!visit) {
      throw new NotFoundException('الكشف الطبي غير موجود');
    }
    return visit;
  }

  async update(id: string, updateDto: UpdateVisitDto): Promise<Visit> {
    const updated = await this.visitModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          ...(updateDto.visitDate && {
            visitDate: new Date(updateDto.visitDate),
          }),
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('الكشف المراد تحديثه غير موجود');
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.visitModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('الكشف المراد حذفه غير موجود');
    }
    return { message: 'تم حذف الكشف الطبي بنجاح' };
  }
}
