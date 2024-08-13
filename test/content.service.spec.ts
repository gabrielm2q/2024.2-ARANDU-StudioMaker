import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from '../src/content/content.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { CreateContentDto } from '../src/content/dtos/create-content.dto';
import { Content } from '../src/content/content.schema';
import { Model } from 'mongoose';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('ContentService', () => {
  let service: ContentService;
  let model: Model<Content>;
  let httpService: HttpService;

  const mockContent = {
    _id: 'mockId',
    title: 'Mock Title',
    body: 'Mock Body',
    user: 'mockUserId',
    trail: 'mockTrailId',
    journey: 'mockJourneyId',
  };

  const mockContentDto: CreateContentDto = {
    title: 'Mock Title',
    body: 'Mock Body',
    user: 'mockUserId',
    trail: 'mockTrailId',
    journey: 'mockJourneyId',
  };

  const mockContentModel = {
    create: jest.fn().mockResolvedValue(mockContent),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockContent),
    }),
  };

  const mockHttpService = {
    post: jest.fn().mockReturnValue(of({ data: { success: true } })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: getModelToken('Content'), useValue: mockContentModel },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    model = module.get<Model<Content>>(getModelToken('Content'));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

//   it('should create a new content', async () => {
//     const result = await service.create(mockContentDto, 'mockToken');
//     expect(result).toEqual(mockContent);
//     expect(model.create).toHaveBeenCalledWith(mockContentDto);
//   });

//   it('should call the external API when creating content', async () => {
//     await service.create(mockContentDto, 'mockToken');
//     expect(httpService.post).toHaveBeenCalledWith(
//       'external-api-url',
//       mockContentDto,
//       { headers: { Authorization: 'Bearer mockToken' } },
//     );
//   });

  it('should throw NotFoundException if content is not found', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.findById('invalidId')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return the content if found', async () => {
    const result = await service.findById('mockId');
    expect(result).toEqual(mockContent);
  });

  it('should throw UnauthorizedException if user is not authorized', async () => {
    await expect(service.create(mockContentDto, '')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
