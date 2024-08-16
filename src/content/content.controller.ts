import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Headers,
  NotFoundException,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from './content.schema';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  async createContent(
    @Body('title') title: string,
    @Body('body') body: string,
    @Headers('trailId') trailId: string,
  ): Promise<Content> {
    if (!title || !body || !trailId) {
      throw new NotFoundException('Title, body, and trailId are required');
    }
    return this.contentService.createContent(title, body, trailId);
  }

  @Get(':id')
  async findContentById(@Param('id') id: string): Promise<Content> {
    return this.contentService.findContentById(id);
  }

  @Get()
  async findAllContents(): Promise<Content[]> {
    return this.contentService.findAllContents();
  }

  @Patch(':id')
  async updateContent(
    @Param('id') id: string,
    @Body() updateData: Partial<Content>,
  ): Promise<Content> {
    return this.contentService.updateContent(id, updateData);
  }

  @Delete(':id')
  async deleteContent(@Param('id') id: string): Promise<void> {
    return this.contentService.deleteContent(id);
  }
}
