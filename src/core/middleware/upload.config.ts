import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let dest = './uploads';
      if (file.fieldname === 'photo' || file.fieldname === 'avatar') {
        dest = './uploads/images';
      } else if (file.fieldname === 'documents') {
        dest = './uploads/documents';
      }

      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + randomUUID();
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'نوع الملف غير مسموح به. الصيغ المسموحة هي: JPG, PNG, WEBP, PDF',
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
