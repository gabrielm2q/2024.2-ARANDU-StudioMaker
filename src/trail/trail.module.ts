import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrailSchema } from './trail.schema';
import { TrailService } from './trail.service';
import { JourneyModule } from '../journey/journey.module';
import { TrailController } from './trail.controller';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trail', schema: TrailSchema }]),
    JourneyModule,
    forwardRef(() => ContentModule), 
  ],
  providers: [TrailService],
  controllers: [TrailController],
  exports: [MongooseModule, TrailService],
})
export class TrailModule {}
