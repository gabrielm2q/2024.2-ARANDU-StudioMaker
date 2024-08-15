import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JourneySchema } from './journey.schema';
import { JourneyService } from './journey.service';
import { HttpModule } from '@nestjs/axios';
import { JourneyController } from './journey.controller';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: 'Journey', schema: JourneySchema }]),
  ],
  providers: [JourneyService],
  controllers: [JourneyController],
})
export class JourneyModule {}
