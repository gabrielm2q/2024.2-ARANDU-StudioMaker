import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dtos/create-journey.dto';
import { UpdateJourneysDtos } from './dtos/updateJourneyOrder';

@Controller('journeys')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Post()
  async create(@Body() body: CreateJourneyDto) {
    const pointId = body.pointId;

    if (!pointId) {
      throw new NotFoundException('Point ID not provided in body');
    }

    return this.journeyService.create(body, pointId);
  }
  @Get()
  async findAll() {
    return this.journeyService.findAll();
  }

  @Get('point/:id')
  async findByUser(@Param('id') pointId: string) {
    return this.journeyService.findByPointId(pointId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.journeyService.findById(id);
  }
  pfc15
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJourneyDto: CreateJourneyDto,
  ) {
    return this.journeyService.update(id, updateJourneyDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.journeyService.delete(id);
  }

  @Patch(':id/add-trail')
  async addTrailToJourney(
    @Param('id') id: string,
    @Body() body: { trailId: string },
  ) {
    return this.journeyService.addTrailToJourney(id, body.trailId);
  }

  @Patch("/update-journey-order")
  async updateJourneyOrder(
    @Body() journeysDto: UpdateJourneysDtos
  ){
    const retorno = await this.journeyService.updateOrderJorney(journeysDto.journeys);
    return retorno;
  }
}
