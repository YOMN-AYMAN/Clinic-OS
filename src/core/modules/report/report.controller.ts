import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinancialReportResponse, ReportsService } from './report.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @Roles(UserRole.DOCTOR)
  async getFinancialReport(): Promise<FinancialReportResponse> {
    return this.reportsService.getFinancialReport();
  }
}
