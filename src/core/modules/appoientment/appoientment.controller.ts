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
import { AppointmentService } from './appoientment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Roles('DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
  async create(@Body() createDto: CreateAppointmentDto) {
    const appointment = await this.appointmentService.create(createDto);
    return {
      message: 'تم حجز الموعد بنجاح',
      appointment,
    };
  }

  @Get()
  @Roles('DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
  async findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @Roles('DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
  async findOne(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Put(':id')
  @Roles('DOCTOR', 'RECEPTIONIST')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.appointmentService.update(id, updateDto);
    return {
      message: 'تم تحديث بيانات الموعد بنجاح',
      appointment,
    };
  }

  @Delete(':id')
  @Roles('DOCTOR', 'RECEPTIONIST')
  async remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
