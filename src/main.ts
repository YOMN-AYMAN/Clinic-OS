import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // إتاحة مسار الملفات الثابتة فقط إن وُجد المجلد محلياً
  const uploadsPath = join(process.cwd(), 'uploads');
  if (existsSync(uploadsPath)) {
    app.useStaticAssets(uploadsPath, {
      prefix: '/uploads/',
    });
  }

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
