import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentSchema } from './content.schema';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TrailModule } from '../trail/trail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    forwardRef(() => TrailModule),  
  ],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService], 
})
export class ContentModule {}
