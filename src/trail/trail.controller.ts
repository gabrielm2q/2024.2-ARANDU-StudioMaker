import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  Headers,
} from '@nestjs/common';
import { TrailService } from './trail.service';

@Controller('trails')
export class TrailController {
  constructor(private readonly trailService: TrailService) {}

  @Post()
  async createTrail(
    @Body() body: { name: string; description?: string },
    @Headers('journey-id') journeyId: string,
  ) {
    if (!journeyId) {
      throw new NotFoundException('Journey ID not provided in header');
    }
    return this.trailService.createTrail(
      body.name,
      body.description,
      journeyId,
    );
  }

  @Get(':id')
  async getTrailById(@Param('id') id: string) {
    return this.trailService.findTrailById(id);
  }

  @Get()
  async getAllTrails() {
    return this.trailService.findAllTrails();
  }

  @Put(':id')
  async updateTrail(
    @Param('id') id: string,
    @Body() updateData: Partial<{ name: string; description?: string }>,
  ) {
    return this.trailService.updateTrail(id, updateData);
  }

  @Delete(':id')
  async deleteTrail(@Param('id') id: string) {
    await this.trailService.deleteTrail(id);
    return { message: 'Trail deleted successfully' };
  }
}
