import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from '../../models/expense.model';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(createDto: CreateExpenseDto): Promise<Expense> {
    const newExpense = new this.expenseModel(createDto);
    return newExpense.save();
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findById(id).exec();
    if (!expense) {
      throw new NotFoundException('المصروف غير موجود');
    }
    return expense;
  }

  async update(id: string, updateDto: UpdateExpenseDto): Promise<Expense> {
    const updated = await this.expenseModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('المصروف المراد تحديثه غير موجود');
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('المصروف المراد حذفه غير موجود');
    }
    return { message: 'تم حذف المصروف بنجاح' };
  }
}
