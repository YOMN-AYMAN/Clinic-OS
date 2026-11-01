import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
} from './dto/prescription.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  async create(@Body() createDto: CreatePrescriptionDto) {
    const prescription = await this.prescriptionService.create(createDto);
    return {
      message: 'تم إصدار الروشتة الطبية بنجاح',
      prescription,
    };
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findAll() {
    return this.prescriptionService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findOne(@Param('id') id: string) {
    return this.prescriptionService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.DOCTOR)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePrescriptionDto,
  ) {
    const prescription = await this.prescriptionService.update(id, updateDto);
    return {
      message: 'تم تحديث الروشتة الطبية بنجاح',
      prescription,
    };
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  async remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }
}
