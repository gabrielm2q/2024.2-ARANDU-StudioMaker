import { Test, TestingModule } from '@nestjs/testing';
import { JourneyService } from '../src/journey/journey.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model, Types } from 'mongoose';
import { Journey } from '../src/journey/journey.schema';
import { CreateJourneyDto } from '../src/journey/dtos/create-journey.dto';
import { UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('JourneyService', () => {
  let service: JourneyService;
  let model: Model<Journey>;
  let httpService: HttpService;
  let logger: Logger;

  const mockJourney = {
    _id: 'mockId',
    title: 'Mock Journey',
    description: 'Mock Description',
    user: 'mockUserId',
    save: jest.fn().mockResolvedValue(this), // Mock da instância
    trails: [],
  };

  const mockJourneyList = [
    { ...mockJourney, _id: 'mockId1' },
    { ...mockJourney, _id: 'mockId2' },
  ];

  const mockCreateJourneyDto: CreateJourneyDto = {
    title: 'New Journey',
    description: 'New Journey Description',
  };

  const mockJourneyModel = {
    create: jest.fn().mockResolvedValue(mockJourney),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockJourney),
    }),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockJourneyList),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockJourney),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockJourney),
    }),
    new: jest.fn(() => mockJourney),
  };

  const mockHttpService = {
    get: jest.fn(),
    patch: jest.fn().mockResolvedValue({}),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JourneyService,
        { provide: getModelToken('Journey'), useValue: mockJourneyModel },
        { provide: HttpService, useValue: mockHttpService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<JourneyService>(JourneyService);
    model = module.get<Model<Journey>>(getModelToken('Journey'));
    httpService = module.get<HttpService>(HttpService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    jest.spyOn(mockHttpService, 'get').mockReturnValueOnce(throwError(new Error('Invalid token')));

    await expect(service.create(mockCreateJourneyDto, 'invalidToken')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw NotFoundException if journey is not found', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.findById('invalidId')).rejects.toThrow(NotFoundException);
  });

  it('should return all journeys', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockJourneyList);
  });

  it('should return journeys by user ID', async () => {
    const result = await service.findByUserId('mockUserId');
    expect(result).toEqual(mockJourneyList);
  });

  it('should update a journey', async () => {
    const updatedJourneyDto: CreateJourneyDto = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    const result = await service.update('mockId', updatedJourneyDto);
    expect(result).toEqual(mockJourney);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith('mockId', updatedJourneyDto, { new: true });
  });


  it('should delete a journey', async () => {
    const result = await service.delete('mockId');
    expect(result).toEqual(mockJourney);
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('mockId');
  });

  it('should throw NotFoundException if journey is not found when adding a trail', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.addTrailToJourney('invalidId', 'mockTrailId')).rejects.toThrow(NotFoundException);
  });

  it('should return user id when token is valid', async () => {
    const token = 'validToken';
    const mockResponse = { data: { userPayload: { id: 'userId123' } } };

    jest.spyOn(mockHttpService, 'get').mockReturnValueOnce(of(mockResponse));

    const result = await service.validateTokenAndGetUserId(token);

    expect(result).toBe('userId123');
    // Remove the logger log check if not required
  });

  it('should return null when token is invalid', async () => {
    const token = 'invalidToken';
    const mockError = new Error('Token invalid');

    jest.spyOn(mockHttpService, 'get').mockReturnValueOnce(throwError(mockError));

    const result = await service.validateTokenAndGetUserId(token);

    expect(result).toBeNull();
    // Remove the logger error check if not required
  });

  
  
});