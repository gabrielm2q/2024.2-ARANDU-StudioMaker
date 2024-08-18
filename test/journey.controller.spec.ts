import { Test, TestingModule } from '@nestjs/testing';

import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JourneyService } from 'src/journey/journey.service';
import { JourneyController } from 'src/journey/journey.controller';
import { CreateJourneyDto } from 'src/journey/dtos/create-journey.dto';

describe('JourneyController', () => {
  let controller: JourneyController;

  const mockJourneyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addTrailToJourney: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JourneyController],
      providers: [
        {
          provide: JourneyService,
          useValue: mockJourneyService,
        },
      ],
    }).compile();

    controller = module.get<JourneyController>(JourneyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a journey', async () => {
      const createJourneyDto: CreateJourneyDto = {
        title: '',
        description: '',
      };
      const token = 'test-token';
      const req = { headers: { authorization: `Bearer ${token}` } } as Request;

      mockJourneyService.create.mockResolvedValue('some-value');

      const result = await controller.create(createJourneyDto, req);
      expect(result).toEqual('some-value');
      expect(mockJourneyService.create).toHaveBeenCalledWith(
        createJourneyDto,
        token,
      );
    });

    it('should throw UnauthorizedException if token is not provided', async () => {
      const createJourneyDto: CreateJourneyDto = {
        title: '',
        description: '',
      };
      const req = { headers: {} } as Request;

      await expect(controller.create(createJourneyDto, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all journeys', async () => {
      mockJourneyService.findAll.mockResolvedValue(['journey1', 'journey2']);

      const result = await controller.findAll();
      expect(result).toEqual(['journey1', 'journey2']);
    });
  });

  describe('findByUser', () => {
    it('should return journeys by user id', async () => {
      const userId = 'user-id';
      mockJourneyService.findByUserId.mockResolvedValue(['journey1']);

      const result = await controller.findByUser(userId);
      expect(result).toEqual(['journey1']);
    });
  });

  describe('findById', () => {
    it('should return a journey by id', async () => {
      const id = 'journey-id';
      mockJourneyService.findById.mockResolvedValue('journey');

      const result = await controller.findById(id);
      expect(result).toEqual('journey');
    });
  });

  describe('update', () => {
    it('should update a journey', async () => {
      const id = 'journey-id';
      const updateJourneyDto: CreateJourneyDto = {
        title: '',
        description: '',
      };
      mockJourneyService.update.mockResolvedValue('updated-journey');

      const result = await controller.update(id, updateJourneyDto);
      expect(result).toEqual('updated-journey');
    });
  });

  describe('delete', () => {
    it('should delete a journey', async () => {
      const id = 'journey-id';
      mockJourneyService.delete.mockResolvedValue('deleted');

      const result = await controller.delete(id);
      expect(result).toEqual('deleted');
    });
  });

  describe('addTrailToJourney', () => {
    it('should add a trail to a journey', async () => {
      const id = 'journey-id';
      const trailId = 'trail-id';
      mockJourneyService.addTrailToJourney.mockResolvedValue('trail-added');

      const result = await controller.addTrailToJourney(id, { trailId });
      expect(result).toEqual('trail-added');
    });
  });
});
