import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './report.controller';
import { ReportsService } from './report.service';
import { Invoice, InvoiceSchema } from '../../models/invoice.model';
import { Expense, ExpenseSchema } from '../../models/expense.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
