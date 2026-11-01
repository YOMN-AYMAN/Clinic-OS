import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from '../../models/patient.model';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const existingPatient = await this.patientModel.findOne({
      phone: createPatientDto.phone,
    });
    if (existingPatient) {
      throw new ConflictException('رقم الهاتف مسجل مسبقاً لمريض آخر');
    }

    const newPatient = new this.patientModel(createPatientDto);
    return newPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException('المريض غير موجود');
    }
    return patient;
  }

  async updatePatient(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    if (updatePatientDto.phone) {
      const existingPatient = await this.patientModel.findOne({
        phone: updatePatientDto.phone,
        _id: { $ne: id },
      });
      if (existingPatient) {
        throw new ConflictException(
          'رقم الهاتف الجديد مستخدم بالفعل لمريض آخر',
        );
      }
    }

    const updatedPatient = await this.patientModel
      .findByIdAndUpdate(id, updatePatientDto, { new: true })
      .exec();

    if (!updatedPatient) {
      throw new NotFoundException('المريض المراد تحديثه غير موجود');
    }

    return updatedPatient;
  }

  async updatePatientPhoto(id: string, photoPath: string): Promise<Patient> {
    return this.updatePatient(id, { photo: photoPath });
  }

  async updatePatientDocument(
    id: string,
    documentPath: string,
  ): Promise<Patient> {
    return this.updatePatient(id, { documents: documentPath });
  }

  async removePatient(id: string): Promise<{ message: string }> {
    const deletedPatient = await this.patientModel.findByIdAndDelete(id).exec();
    if (!deletedPatient) {
      throw new NotFoundException('المريض المراد حذفه غير موجود');
    }
    return { message: 'تم حذف المريض بنجاح' };
  }
}
