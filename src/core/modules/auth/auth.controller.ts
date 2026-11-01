import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { multerConfig } from '../../middleware/upload.config';
import type { UserDocument } from '../../models/user.model';
import { UserRole } from '../../enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async signup(
    @Body() dto: SignupDto,
    @UploadedFiles()
    files?: {
      photo?: Express.Multer.File[];
      avatar?: Express.Multer.File[];
    },
  ) {
    const uploadedFile = files?.photo?.[0] || files?.avatar?.[0];
    if (uploadedFile) {
      dto.photo = uploadedFile.path.replace(/\\/g, '/');
    }
    return this.authService.signup(dto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('signin')
  async signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: UserDocument }): UserDocument {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @Get('doctors-list')
  async getDoctorsList() {
    return this.authService.getAllDoctors();
  }
}
