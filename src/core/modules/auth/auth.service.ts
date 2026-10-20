import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../../models/user.model';
import { MailService } from '../../utils/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: {
    name: string;
    email: string;
    password: string;
    role: string;
    specialization?: string;
    photo?: string;
  }) {
    if (dto.role === 'DOCTOR' && !dto.specialization) {
      throw new BadRequestException('التخصص مطلوب للطبيب');
    }

    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException('البريد الإلكتروني مستخدم بالفعل');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new this.userModel({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      specialization: dto.specialization,
      photo: dto.photo,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();

    await this.mailService.sendOtpEmail(dto.email, otp);

    return {
      message:
        'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لإدخال كود التحقق (OTP).',
      email: dto.email,
    };
  }

  async verifyOtp(dto: { email: string; otp: string }) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    if (user.isVerified) {
      throw new BadRequestException('الحساب مُفعل بالفعل');
    }

    if (
      user.otp !== dto.otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      throw new BadRequestException('كود التحقق غير صحيح أو انتهت صلاحيته');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: 'تم تفعيل الحساب بنجاح، يمكنك تسجيل الدخول الآن' };
  }

  async signin(dto: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    if (!user.isVerified) {
      throw new BadRequestException(
        'الحساب غير مفعل. يرجى إدخال كود التحقق المرسل إلى بريدك الإلكتروني أولاً',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('هذا الحساب معطل، يرجى مراجعة المسؤول');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'تم تسجيل الدخول بنجاح',
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        specialization: user.specialization,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('البريد الإلكتروني غير مسجل لدينا');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await this.mailService.sendOtpEmail(email, otp);

    return {
      message: 'تم إرسال كود إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
    };
  }

  async resetPassword(dto: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    if (
      user.otp !== dto.otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      throw new BadRequestException('كود التحقق غير صحيح أو انتهت صلاحيته');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(dto.newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: 'تم تغيير كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن' };
  }

  async updatePhoto(userId: string, photoPath: string) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { photo: photoPath }, { new: true })
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return {
      message: 'تم تحديث الصورة الشخصية بنجاح',
      photo: user.photo,
      user,
    };
  }

  async getAllDoctors() {
    const doctors = await this.userModel
      .find({ role: 'DOCTOR' })
      .select('-passwordHash -otp -otpExpires');
    return {
      count: doctors.length,
      doctors,
    };
  }
}
