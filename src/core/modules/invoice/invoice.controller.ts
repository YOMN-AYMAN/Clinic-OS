import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService, InvoiceWithRemaining } from './invoice.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  AddPaymentDto,
} from './dto/invoice.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Roles(UserRole.RECEPTIONIST, UserRole.DOCTOR)
  async create(@Body() createDto: CreateInvoiceDto) {
    const invoice = await this.invoiceService.create(createDto);
    return {
      message: 'تم إصدار الفاتورة بنجاح',
      invoice,
    };
  }

  @Post(':id/payments')
  @Roles(UserRole.RECEPTIONIST, UserRole.DOCTOR)
  async addPayment(@Param('id') id: string, @Body() paymentDto: AddPaymentDto) {
    const invoice = await this.invoiceService.addPayment(id, paymentDto);
    return {
      message: 'تم تسجيل الدفعة المالية بنجاح',
      invoice,
    };
  }

  @Put(':id')
  @Roles(UserRole.RECEPTIONIST, UserRole.DOCTOR)
  async update(@Param('id') id: string, @Body() updateDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceService.update(id, updateDto);
    return {
      message: 'تم تحديث بيانات الفاتورة بنجاح',
      invoice,
    };
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findAll(): Promise<InvoiceWithRemaining[]> {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findOne(@Param('id') id: string): Promise<InvoiceWithRemaining> {
    return this.invoiceService.findById(id);
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  async remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
}
