import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from '../../models/invoice.model';
import { Expense, ExpenseDocument } from '../../models/expense.model';
import { ExpenseType } from '../../enums';

export interface FinancialReportData {
  revenue: {
    totalInvoicesValue: number;
    totalCollectedRevenue: number;
    outstandingDues: number;
  };
  expenses: {
    totalExpenses: number;
    totalSalaries: number;
    totalPurchases: number;
  };
  netProfit: number;
}

export interface FinancialReportResponse {
  success: boolean;
  message: string;
  data: FinancialReportData;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async getFinancialReport(): Promise<FinancialReportResponse> {
    const invoices = await this.invoiceModel.find().exec();

    let totalRevenue = 0;
    let totalInvoicesAmount = 0;
    let outstandingDues = 0;

    invoices.forEach((inv) => {
      totalInvoicesAmount += inv.total;
      totalRevenue += inv.paidAmount;
      outstandingDues += inv.total - inv.paidAmount;
    });

    const expenses = await this.expenseModel.find().exec();
    let totalExpenses = 0;
    let totalSalaries = 0;
    let totalPurchases = 0;

    expenses.forEach((exp) => {
      totalExpenses += exp.amount;
      if (exp.type === ExpenseType.SALARY) {
        totalSalaries += exp.amount;
      } else if (exp.type === ExpenseType.PURCHASE) {
        totalPurchases += exp.amount;
      }
    });

    const netProfit = totalRevenue - totalExpenses;

    return {
      success: true,
      message: 'تم استخراج التقرير المالي بنجاح',
      data: {
        revenue: {
          totalInvoicesValue: totalInvoicesAmount,
          totalCollectedRevenue: totalRevenue,
          outstandingDues: outstandingDues,
        },
        expenses: {
          totalExpenses: totalExpenses,
          totalSalaries: totalSalaries,
          totalPurchases: totalPurchases,
        },
        netProfit: netProfit,
      },
    };
  }
}
