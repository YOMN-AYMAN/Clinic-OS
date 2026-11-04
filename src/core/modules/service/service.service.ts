import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from '../../models/service.model';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(createDto: CreateServiceDto): Promise<Service> {
    const existing = await this.serviceModel
      .findOne({ name: createDto.name })
      .exec();
    if (existing) {
      throw new ConflictException('هذه الخدمة موجودة مسبقاً');
    }
    const newService = new this.serviceModel(createDto);
    return newService.save();
  }

  async findAll(): Promise<Service[]> {
    return this.serviceModel.find().exec();
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException('الخدمة غير موجودة');
    }
    return service;
  }

  async update(id: string, updateDto: UpdateServiceDto): Promise<Service> {
    const updated = await this.serviceModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('الخدمة المراد تحديثها غير موجودة');
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('الخدمة المراد حذفها غير موجودة');
    }
    return { message: 'تم حذف الخدمة بنجاح' };
  }
}
