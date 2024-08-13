import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dtos/create-content.dto';
import { Request } from 'express';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  async create(
    @Body() createContentDto: CreateContentDto,
    @Req() req: Request,
  ) {
    const authHeader = req.headers.authorization as string;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    return this.contentService.create(createContentDto, token);
  }

  @Get()
  async findAll() {
    return this.contentService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.contentService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: CreateContentDto,
  ) {
    return this.contentService.update(id, updateContentDto);
  }
}
