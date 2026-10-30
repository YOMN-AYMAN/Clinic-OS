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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visits')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  @Roles('DOCTOR', 'ASSISTANT')
  async create(@Body() createDto: CreateVisitDto) {
    const visit = await this.visitService.create(createDto);
    return {
      message: 'تم تسجيل الكشف الطبي بنجاح',
      visit,
    };
  }

  @Get()
  @Roles('DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
  async findAll() {
    return this.visitService.findAll();
  }

  @Get(':id')
  @Roles('DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
  async findOne(@Param('id') id: string) {
    return this.visitService.findById(id);
  }

  @Put(':id')
  @Roles('DOCTOR', 'ASSISTANT')
  async update(@Param('id') id: string, @Body() updateDto: UpdateVisitDto) {
    const visit = await this.visitService.update(id, updateDto);
    return {
      message: 'تم تحديث بيانات الكشف بنجاح',
      visit,
    };
  }

  @Delete(':id')
  @Roles('DOCTOR')
  async remove(@Param('id') id: string) {
    return this.visitService.remove(id);
  }
}
