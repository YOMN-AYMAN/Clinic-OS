import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { multerConfig } from '../../middleware/upload.config';
import type { Express } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @Roles('DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'documents', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @UploadedFiles()
    files?: {
      photo?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    if (files?.photo?.[0]) {
      createPatientDto.photo = files.photo[0].path.replace(/\\/g, '/');
    }

    if (files?.documents?.[0]) {
      createPatientDto.documents = files.documents[0].path.replace(/\\/g, '/');
    }

    const patient = await this.patientService.createPatient(createPatientDto);
    return {
      message: 'تم تسجيل المريض ورفع المستندات بنجاح',
      patient,
    };
  }

  @Get()
  @Roles('DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
  async findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  @Roles('DOCTOR', 'RECEPTIONIST', 'ASSISTANT')
  async findOne(@Param('id') id: string) {
    return this.patientService.findById(id);
  }

  @Put(':id')
  @Roles('DOCTOR', 'RECEPTIONIST')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
        { name: 'documents', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @UploadedFiles()
    files?: {
      photo?: Express.Multer.File[];
      avatar?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    const photoFile = files?.photo?.[0] || files?.avatar?.[0];
    if (photoFile) {
      updatePatientDto.photo = photoFile.path.replace(/\\/g, '/');
    }

    const docFile = files?.documents?.[0];
    if (docFile) {
      updatePatientDto.documents = docFile.path.replace(/\\/g, '/');
    }

    const patient = await this.patientService.updatePatient(
      id,
      updatePatientDto,
    );
    return {
      message: 'تم تحديث بيانات المريض بنجاح',
      patient,
    };
  }

  @Post(':id/photo')
  @Roles('DOCTOR', 'RECEPTIONIST')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('يرجى اختيار صورة لرفعها');
    }
    const photoPath = file.path.replace(/\\/g, '/');
    const patient = await this.patientService.updatePatientPhoto(id, photoPath);
    return {
      message: 'تم رفع صورة المريض بنجاح',
      patient,
    };
  }

  @Post(':id/documents')
  @Roles('DOCTOR', 'RECEPTIONIST')
  @UseInterceptors(FileInterceptor('documents', multerConfig))
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('يرجى اختيار مستند لرفعه');
    }
    const docPath = file.path.replace(/\\/g, '/');
    const patient = await this.patientService.updatePatientDocument(
      id,
      docPath,
    );
    return {
      message: 'تم رفع مستند المريض بنجاح',
      patient,
    };
  }

  @Delete(':id')
  @Roles('DOCTOR')
  async remove(@Param('id') id: string) {
    return this.patientService.removePatient(id);
  }
}
