import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrailSchema } from './trail.schema';
import { TrailService } from './trail.service';
import { JourneyModule } from '../journey/journey.module';
import { TrailController } from './trail.controller';
import { JourneyService } from 'src/journey/journey.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trail', schema: TrailSchema }]),
    JourneyModule,
  ],
  providers: [TrailService],
  controllers: [TrailController],
})
export class TrailModule {}
