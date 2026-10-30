import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Visit, VisitSchema } from '../../models/visit.model';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]),
  ],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}
