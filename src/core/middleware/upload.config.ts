import { memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  storage: memoryStorage(),
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
