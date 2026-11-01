export enum ServiceType {
  NEW_EXAM = 'كشف جديد',
  RE_EXAM = 'إعادة كشف',
  CONSULTATION = 'استشارة طبية',
  FOLLOW_UP = 'متابعة',
}

export enum AppointmentStatus {
  PENDING = 'قيد الانتظار',
  COMPLETED = 'مكتمل',
  CANCELLED = 'ملغي',
}

export enum VisitStatus {
  IN_PROGRESS = 'جاري الكشف',
  COMPLETED = 'مكتمل',
}

export enum InvoiceStatus {
  UNPAID = 'غير مدفوع',
  PARTIAL = 'مدفوع جزئياً',
  PAID = 'مدفوع',
}

export enum PaymentMethod {
  CASH = 'نقدي',
  CARD = 'بطاقة',
  TRANSFER = 'تحويل بنكي',
}

export enum ExpenseType {
  SALARY = 'راتب',
  PURCHASE = 'مشتريات',
}

export enum Gender {
  MALE = 'ذكر',
  FEMALE = 'أنثى',
}

export enum UserRole {
  DOCTOR = 'طبيب',
  RECEPTIONIST = 'موظف استقبال',
  ASSISTANT = 'مساعد',
}
