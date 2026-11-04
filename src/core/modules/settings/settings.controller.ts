import { Controller, Get, Body, Put, UseGuards } from '@nestjs/common';
import { ClinicSettingsService } from './settings.service';
import { UpdateClinicSettingsDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class ClinicSettingsController {
  constructor(private readonly clinicSettingsService: ClinicSettingsService) {}

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async getSettings() {
    return this.clinicSettingsService.getSettings();
  }

  @Put()
  @Roles(UserRole.DOCTOR)
  async updateSettings(@Body() updateDto: UpdateClinicSettingsDto) {
    return this.clinicSettingsService.updateSettings(updateDto);
  }
}
