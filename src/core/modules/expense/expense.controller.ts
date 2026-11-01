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
import { ExpenseService } from './expense.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async create(@Body() createDto: CreateExpenseDto) {
    const expense = await this.expenseService.create(createDto);
    return {
      message: 'تم تسجيل المصروف بنجاح',
      expense,
    };
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ASSISTANT)
  async findOne(@Param('id') id: string) {
    return this.expenseService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async update(@Param('id') id: string, @Body() updateDto: UpdateExpenseDto) {
    const expense = await this.expenseService.update(id, updateDto);
    return {
      message: 'تم تحديث المصروف بنجاح',
      expense,
    };
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  async remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}
