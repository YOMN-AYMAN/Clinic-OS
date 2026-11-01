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
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async create(@Body() createDto: CreateAppointmentDto) {
    const appointment = await this.appointmentService.create(createDto);
    return {
      message: 'تم حجز الموعد بنجاح',
      appointment,
    };
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findOne(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST)
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
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
