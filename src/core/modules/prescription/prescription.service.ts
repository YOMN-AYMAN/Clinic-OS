import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Prescription,
  PrescriptionDocument,
} from '../../models/prescription.model';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
} from './dto/prescription.dto';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<PrescriptionDocument>,
  ) {}

  async create(createDto: CreatePrescriptionDto): Promise<Prescription> {
    const existingPrescription = await this.prescriptionModel.findOne({
      visitId: new Types.ObjectId(createDto.visitId),
    });

    if (existingPrescription) {
      throw new ConflictException('توجد روشطة طبية مسجلة مسبقاً لهذا الكشف');
    }

    const newPrescription = new this.prescriptionModel({
      ...createDto,
      visitId: new Types.ObjectId(createDto.visitId),
    });

    return newPrescription.save();
  }

  async findAll(): Promise<Prescription[]> {
    return this.prescriptionModel
      .find()
      .populate({
        path: 'visitId',
        populate: [
          { path: 'patientId', select: 'name phone' },
          { path: 'doctorId', select: 'name specialization' },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionModel
      .findById(id)
      .populate({
        path: 'visitId',
        populate: [
          { path: 'patientId', select: 'name phone' },
          { path: 'doctorId', select: 'name specialization' },
        ],
      })
      .exec();

    if (!prescription) {
      throw new NotFoundException('الروشتة الطبية غير موجودة');
    }
    return prescription;
  }

  async update(
    id: string,
    updateDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    const updated = await this.prescriptionModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('الروشتة المراد تحديثها غير موجودة');
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.prescriptionModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('الروشتة المراد حذفها غير موجودة');
    }
    return { message: 'تم حذف الروشتة الطبية بنجاح' };
  }
}
