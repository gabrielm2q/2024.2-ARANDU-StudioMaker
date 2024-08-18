import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trail } from './trail.schema';
import { Journey } from 'src/journey/journey.schema';
import { JourneyService } from 'src/journey/journey.service';

@Injectable()
export class TrailService {
  constructor(
    @InjectModel('Trail') private readonly trailModel: Model<Trail>,
    @InjectModel('Journey') private readonly journeyModel: Model<Journey>,
    private readonly journeyService: JourneyService,
  ) {}

  async createTrail(name: string, journeyId: string): Promise<Trail> {
    const journeyExists = await this.journeyModel.findById(journeyId).exec();
    if (!journeyExists) {
      throw new NotFoundException(`Journey with ID ${journeyId} not found`);
    }

    const newTrail = new this.trailModel({
      name,
      journey: journeyId,
    });

    await this.journeyService.addTrailToJourney(
      journeyId,
      newTrail._id.toString(),
    );

    return newTrail.save();
  }

  async addContentToTrail(trailId: string, contentId: string): Promise<Trail> {
    const trail = await this.trailModel.findById(trailId).exec();
    if (!trail) {
      throw new NotFoundException(`Trail with ID ${trailId} not found`);
    }

    const objectId = new Types.ObjectId(contentId);

    if (!trail.contents) {
      trail.contents = [];
    }

    trail.contents.push(objectId);

    return trail.save();
  }

  async removeContentFromTrail(
    trailId: string,
    contentId: string,
  ): Promise<Trail> {
    const trail = await this.trailModel.findById(trailId).exec();
    if (!trail) {
      throw new NotFoundException(`Trail with ID ${trailId} not found`);
    }

    trail.contents = trail.contents.filter(
      (content) => !content.equals(contentId),
    );

    return trail.save();
  }

  async findTrailById(id: string): Promise<Trail> {
    const trail = await this.trailModel.findById(id).exec();
    if (!trail) {
      throw new NotFoundException(`Trail with ID ${id} not found`);
    }
    return trail;
  }

  async findAllTrails(): Promise<Trail[]> {
    return this.trailModel.find().exec();
  }

  async updateTrail(id: string, updateData: Partial<Trail>): Promise<Trail> {
    const trail = await this.trailModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!trail) {
      throw new NotFoundException(`Trail with ID ${id} not found`);
    }
    return trail;
  }

  async deleteTrail(id: string): Promise<void> {
    const result = await this.trailModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Trail with ID ${id} not found`);
    }
  }
}
