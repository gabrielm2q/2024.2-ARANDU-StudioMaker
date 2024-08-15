import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Journey } from './journey.schema';
import { CreateJourneyDto } from './dtos/create-journey.dto';

@Injectable()
export class JourneyService {
  private readonly logger = new Logger(JourneyService.name);

  constructor(
    @InjectModel('Journey') private readonly journeyModel: Model<Journey>,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createJourneyDto: CreateJourneyDto,
    token: string,
  ): Promise<Journey> {
    const userId = await this.validateTokenAndGetUserId(token);

    this.logger.log(`User ID from token: ${userId}`);

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const newJourney = new this.journeyModel({
      ...createJourneyDto,
      user: userId,
    });
    const savedJourney = await newJourney.save();

    // Atualizar o usuário com o novo ID de jornada
    await this.addJourneyToUser(userId, savedJourney._id.toString());

    return savedJourney;
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

  async addJourneyToUser(userId: string, journeyId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.patch(
          `${process.env.USER_SERVICE_URL}/${userId}/add-journey`,
          { journeyId },
        ),
      );
      this.logger.log(`Added journey ${journeyId} to user ${userId}`);
    } catch (err) {
      this.logger.error(`Failed to add journey to user: ${err.message}`);
      throw new NotFoundException('Failed to update user with new journey');
    }
  }

  async findAll(): Promise<Journey[]> {
    return this.journeyModel.find().exec();
  }

  async findById(id: string): Promise<Journey> {
    const journey = await this.journeyModel.findById(id).exec();
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return journey;
  }

  async update(
    id: string,
    updateJourneyDto: CreateJourneyDto,
  ): Promise<Journey> {
    const journey = await this.journeyModel
      .findByIdAndUpdate(id, updateJourneyDto, { new: true })
      .exec();
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return journey;
  }

  async delete(id: string): Promise<Journey> {
    const journey = await this.journeyModel.findByIdAndDelete(id).exec();
    if (!journey) {
      throw new NotFoundException(`Journey with ID ${id} not found`);
    }
    return journey;
  }
}
