import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from './content.schema';
import { Trail } from '../trail/trail.schema';
import { TrailService } from '../trail/trail.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel('Content') private readonly contentModel: Model<Content>,
    @InjectModel('Trail') private readonly trailModel: Model<Trail>,
    private readonly trailService: TrailService,
  ) {}

  async createContent(
    title: string,
    body: string,
    trailId: string,
  ): Promise<Content> {
    const trailExists = await this.trailModel.findById(trailId).exec();
    if (!trailExists) {
      throw new NotFoundException(`Trail with ID ${trailId} not found`);
    }

    const newContent = new this.contentModel({
      title,
      body,
      trail: trailId,
    });

    await this.trailService.addContentToTrail(
      trailId,
      newContent._id.toString(),
    );

    return newContent.save();
  }

  async findContentById(id: string): Promise<Content> {
    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async findAllContents(): Promise<Content[]> {
    return this.contentModel.find().exec();
  }

  async updateContent(
    id: string,
    updateData: Partial<Content>,
  ): Promise<Content> {
    const content = await this.contentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async deleteContent(id: string): Promise<void> {
    const result = await this.contentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
  }
}
