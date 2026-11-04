import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceDocument } from '../../models/invoice.model';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  AddPaymentDto,
} from './dto/invoice.dto';
import { InvoiceStatus, PaymentMethod } from '../../enums';

export interface InvoiceItem {
  name: string;
  price: number;
  qty: number;
}

export interface InvoicePayment {
  amount: number;
  method: PaymentMethod;
  paidAt: Date;
  receivedBy: string;
}

export interface InvoiceWithRemaining {
  _id: unknown;
  patientId: unknown;
  appointmentId: unknown;
  items: InvoiceItem[];
  total: number;
  paidAmount: number;
  status: InvoiceStatus;
  payments: InvoicePayment[];
  remaining: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create(createDto: CreateInvoiceDto): Promise<Invoice> {
    const existingInvoice = await this.invoiceModel.findOne({
      appointmentId: new Types.ObjectId(createDto.appointmentId),
    });

    if (existingInvoice) {
      throw new ConflictException('توجد فاتورة مسجلة مسبقاً لهذا الموعد');
    }

    const total = createDto.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    );

    const paidAmount = createDto.paidAmount || 0;

    if (paidAmount > total) {
      throw new BadRequestException(
        'المبلغ المدفوع لا يمكن أن يتجاوز إجمالي الفاتورة',
      );
    }

    // تحديد الحالة تلقائياً
    let status: InvoiceStatus = InvoiceStatus.UNPAID;
    if (paidAmount === total && total > 0) {
      status = InvoiceStatus.PAID;
    } else if (paidAmount > 0 && paidAmount < total) {
      status = InvoiceStatus.PARTIAL;
    }

    const payments: InvoicePayment[] = [];

    if (paidAmount > 0) {
      payments.push({
        amount: paidAmount,
        method: createDto.paymentMethod || PaymentMethod.CASH,
        paidAt: new Date(),
        receivedBy: createDto.receivedBy || 'System',
      });
    }

    const newInvoice = new this.invoiceModel({
      patientId: new Types.ObjectId(createDto.patientId),
      appointmentId: new Types.ObjectId(createDto.appointmentId),
      items: createDto.items,
      total,
      paidAmount,
      status,
      payments,
    });

    return newInvoice.save();
  }

  async addPayment(id: string, paymentDto: AddPaymentDto): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new NotFoundException('الفاتورة غير موجودة');
    }

    const remaining = invoice.total - invoice.paidAmount;
    if (paymentDto.amount > remaining) {
      throw new BadRequestException(
        `المبلغ المراد دفعه (${paymentDto.amount}) أكبر من المبلغ المتبقي (${remaining})`,
      );
    }

    const newPaidAmount = invoice.paidAmount + paymentDto.amount;
    let status: InvoiceStatus = InvoiceStatus.PARTIAL;
    if (newPaidAmount === invoice.total) {
      status = InvoiceStatus.PAID;
    }

    invoice.paidAmount = newPaidAmount;
    invoice.status = status;
    invoice.payments.push({
      amount: paymentDto.amount,
      method: paymentDto.method,
      paidAt: new Date(),
      receivedBy: paymentDto.receivedBy,
    });

    return invoice.save();
  }

  async update(id: string, updateDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new NotFoundException('الفاتورة غير موجودة');
    }

    let total = invoice.total;
    if (updateDto.items) {
      total = updateDto.items.reduce(
        (acc, item) => acc + item.price * item.qty,
        0,
      );
    }

    const paidAmount =
      updateDto.paidAmount !== undefined
        ? updateDto.paidAmount
        : invoice.paidAmount;

    if (paidAmount > total) {
      throw new BadRequestException(
        'المبلغ المدفوع لا يمكن أن يتجاوز إجمالي الفاتورة',
      );
    }

    let status = invoice.status;
    if (paidAmount === total && total > 0) {
      status = InvoiceStatus.PAID;
    } else if (paidAmount > 0 && paidAmount < total) {
      status = InvoiceStatus.PARTIAL;
    } else if (paidAmount === 0) {
      status = InvoiceStatus.UNPAID;
    }

    const updatedPayments = invoice.payments;
    if (
      (updateDto.receivedBy || updateDto.paymentMethod) &&
      updatedPayments &&
      updatedPayments.length > 0
    ) {
      const lastPayment = updatedPayments[updatedPayments.length - 1];
      if (updateDto.receivedBy) {
        lastPayment.receivedBy = updateDto.receivedBy;
      }
      if (updateDto.paymentMethod) {
        lastPayment.method = updateDto.paymentMethod;
      }
    }

    const updated = await this.invoiceModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          total,
          paidAmount,
          status,
          payments: updatedPayments,
          ...(updateDto.patientId && {
            patientId: new Types.ObjectId(updateDto.patientId),
          }),
          ...(updateDto.appointmentId && {
            appointmentId: new Types.ObjectId(updateDto.appointmentId),
          }),
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('الفاتورة المراد تحديثها غير موجودة');
    }

    return updated;
  }

  async findAll(): Promise<InvoiceWithRemaining[]> {
    const invoices = await this.invoiceModel
      .find()
      .populate('patientId', 'name phone')
      .populate('appointmentId', 'date time')
      .sort({ createdAt: -1 })
      .exec();

    return invoices.map((inv) => {
      const invObj = inv.toObject() as unknown as InvoiceWithRemaining;
      return {
        ...invObj,
        remaining: invObj.total - invObj.paidAmount,
      };
    });
  }

  async findById(id: string): Promise<InvoiceWithRemaining> {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate('patientId', 'name phone')
      .populate('appointmentId', 'date time')
      .exec();

    if (!invoice) {
      throw new NotFoundException('الفاتورة غير موجودة');
    }

    const invObj = invoice.toObject() as unknown as InvoiceWithRemaining;
    return {
      ...invObj,
      remaining: invObj.total - invObj.paidAmount,
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.invoiceModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('الفاتورة المراد حذفها غير موجودة');
    }
    return { message: 'تم حذف الفاتورة بنجاح' };
  }
}
