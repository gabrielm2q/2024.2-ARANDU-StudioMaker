import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentSchema } from './content.schema';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
  ],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
