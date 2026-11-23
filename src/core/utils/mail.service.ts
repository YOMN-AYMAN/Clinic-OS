// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//   private transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'yomna.aym@gmail.com',
//       pass: 'xpqtlwazkzrrvzaf',
//     },
//     logger: true,
//     debug: true,
//   });

//   async sendOtpEmail(email: string, otp: string) {
//     try {
//       await this.transporter.sendMail({
//         from: '"ClinicOS Support" <support@clinicos.com>',
//         to: email,
//         subject: 'كود التحقق الخاص بك في نظام ClinicOS',
//         html: `
//           <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
//             <h2>مرحباً بك في ClinicOS</h2>
//             <p>كود التحقق الخاص بك هو:</p>
//             <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
//             <p>هذا الكود صالح لمدة 10 دقائق فقط.</p>
//           </div>
//         `,
//       });
//       console.log('Email sent successfully!');
//     } catch (error) {
//       console.error('Error sending email:', error);
//       throw error;
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendOtpEmail(email: string, otp: string) {
    try {
      const fromAddress =
        process.env.MAIL_FROM || 'ClinicOS Support <onboarding@resend.dev>';

      const { error } = await this.resend.emails.send({
        from: fromAddress,
        to: email,
        subject: 'كود التحقق الخاص بك في نظام ClinicOS',
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
            <h2>مرحباً بك في ClinicOS</h2>
            <p>كود التحقق الخاص بك هو:</p>
            <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
            <p>هذا الكود صالح لمدة 10 دقائق فقط.</p>
          </div>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
