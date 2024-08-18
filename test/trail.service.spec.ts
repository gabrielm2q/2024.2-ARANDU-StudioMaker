import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { JourneyService } from 'src/journey/journey.service';
import { Journey } from 'src/journey/journey.schema';
import { TrailService } from 'src/trail/trail.service';
import { Trail } from 'src/trail/trail.schema';

describe('TrailService', () => {
  let service: TrailService;
  let trailModel: Model<Trail>;
  let journeyModel: Model<Journey>;

  const mockTrail = {
    _id: 'mockTrailId',
    name: 'Mock Trail',
    journey: 'mockJourneyId',
    contents: [],
    save: jest.fn().mockResolvedValue(this),
  };

  const mockJourney = {
    _id: 'mockJourneyId',
    name: 'Mock Journey',
    trails: [],
  };

  const mockTrailModel = {
    create: jest.fn().mockResolvedValue(mockTrail),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTrail),
    }),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockTrail]),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTrail),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTrail),
    }),
  };

  const mockJourneyModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockJourney),
    }),
  };

  const mockJourneyService = {
    addTrailToJourney: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrailService,
        { provide: getModelToken('Trail'), useValue: mockTrailModel },
        { provide: getModelToken('Journey'), useValue: mockJourneyModel },
        { provide: JourneyService, useValue: mockJourneyService },
      ],
    }).compile();

    service = module.get<TrailService>(TrailService);
    trailModel = module.get<Model<Trail>>(getModelToken('Trail'));
    journeyModel = module.get<Model<Journey>>(getModelToken('Journey'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if journey is not found when creating a trail', async () => {
    jest.spyOn(journeyModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(
      service.createTrail('New Trail', 'invalidJourneyId'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if trail is not found when adding content', async () => {
    jest.spyOn(trailModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(
      service.addContentToTrail('invalidTrailId', 'mockContentId'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if trail is not found when removing content', async () => {
    jest.spyOn(trailModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(
      service.removeContentFromTrail('invalidTrailId', 'mockContentId'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find a trail by ID', async () => {
    const result = await service.findTrailById('mockTrailId');
    expect(result).toEqual(mockTrail);
    expect(trailModel.findById).toHaveBeenCalledWith('mockTrailId');
  });

  it('should throw NotFoundException if trail is not found when finding by ID', async () => {
    jest.spyOn(trailModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.findTrailById('invalidTrailId')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return all trails', async () => {
    const result = await service.findAllTrails();
    expect(result).toEqual([mockTrail]);
    expect(trailModel.find).toHaveBeenCalled();
  });

  it('should update a trail', async () => {
    const updateData = { name: 'Updated Trail' };
    const result = await service.updateTrail('mockTrailId', updateData);
    expect(result).toEqual(mockTrail);
    expect(trailModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'mockTrailId',
      updateData,
      { new: true },
    );
  });

  it('should throw NotFoundException if trail is not found when updating', async () => {
    jest.spyOn(trailModel, 'findByIdAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(
      service.updateTrail('invalidTrailId', { name: 'Updated Trail' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if trail is not found when deleting', async () => {
    jest.spyOn(trailModel, 'findByIdAndDelete').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.deleteTrail('invalidTrailId')).rejects.toThrow(
      NotFoundException,
    );
  });
});
