import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  async create(@Body() createDto: CreateServiceDto) {
    const service = await this.serviceService.create(createDto);
    return {
      message: 'تم إضافة الخدمة بنجاح',
      service,
    };
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findOne(@Param('id') id: string) {
    return this.serviceService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.DOCTOR)
  async update(@Param('id') id: string, @Body() updateDto: UpdateServiceDto) {
    const service = await this.serviceService.update(id, updateDto);
    return {
      message: 'تم تحديث الخدمة بنجاح',
      service,
    };
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  async remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}
