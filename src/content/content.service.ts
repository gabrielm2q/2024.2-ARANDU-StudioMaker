import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from './content.schema';
import { CreateContentDto } from './dtos/create-content.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    @InjectModel('Content') private readonly contentModel: Model<Content>,    
    private readonly httpService: HttpService,
  ) {}

  async create(
    createContentDto: CreateContentDto,
    token: string,
  ): Promise<Content> {
    const userId = await this.validateTokenAndGetUserId(token);

    this.logger.log(`User ID from token: ${userId}`);

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const newContent = new this.contentModel({
      ...createContentDto,
      user: userId,
    });
    return newContent.save();
  }

  async validateTokenAndGetUserId(token: string): Promise<string | null> {
    try {
      this.logger.log(`Validating token: ${token}`);
      const response = await firstValueFrom(
        this.httpService.get(`${process.env.AUTH_SERVICE_URL}/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      this.logger.log(
        `Token validation response: ${JSON.stringify(response.data)}`,
      );
      return response.data.userPayload?.id || null;
    } catch (err) {
      this.logger.error(`Token validation failed: ${err.message}`);
      return null;
    }
  }
  

  async findAll(): Promise<Content[]> {
    return this.contentModel.find().exec();
  }

  async findById(id: string): Promise<Content> {
    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async update(
    id: string,
    updateContentDto: CreateContentDto,
  ): Promise<Content> {
    const content = await this.contentModel
      .findByIdAndUpdate(id, updateContentDto, { new: true })
      .exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }
}
