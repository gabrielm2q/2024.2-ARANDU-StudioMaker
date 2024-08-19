import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from './content.schema';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  async createContent(
    @Body() body: { title: string; content: string; trailId: string },
  ): Promise<Content> {
    const { title, content, trailId } = body;

    if (!title || !content || !trailId) {
      throw new NotFoundException('Title, content, and trailId are required');
    }

    return this.contentService.createContent(title, content, trailId);
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
