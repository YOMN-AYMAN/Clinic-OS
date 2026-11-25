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

@Injectable()
export class MailService {
  async sendOtpEmail(email: string, otp: string) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'yomna.aym@gmail.com';

    if (!apiKey) {
      throw new Error('BREVO_API_KEY is missing in environment variables');
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'ClinicOS Support',
            email: senderEmail,
          },
          to: [{ email }],
          subject: 'كود التحقق الخاص بك في نظام ClinicOS',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
              <h2>مرحباً بك في ClinicOS</h2>
              <p>كود التحقق الخاص بك هو:</p>
              <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
              <p>هذا الكود صالح لمدة 10 دقائق فقط.</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo API error (${response.status}): ${errorData}`);
      }

      console.log('Email sent successfully via Brevo API!');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
