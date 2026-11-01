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
import { VisitService } from './visit.service';
import { CreateVisitDto, UpdateVisitDto } from './dto/visit.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visits')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
  async create(@Body() createDto: CreateVisitDto) {
    const visit = await this.visitService.create(createDto);
    return {
      message: 'تم تسجيل الكشف الطبي بنجاح',
      visit,
    };
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findAll() {
    return this.visitService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findOne(@Param('id') id: string) {
    return this.visitService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.DOCTOR, UserRole.ASSISTANT)
  async update(@Param('id') id: string, @Body() updateDto: UpdateVisitDto) {
    const visit = await this.visitService.update(id, updateDto);
    return {
      message: 'تم تحديث بيانات الكشف بنجاح',
      visit,
    };
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  async remove(@Param('id') id: string) {
    return this.visitService.remove(id);
  }
}
