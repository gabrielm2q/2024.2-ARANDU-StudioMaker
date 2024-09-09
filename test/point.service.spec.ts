import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { of } from 'rxjs';
import { PointService } from 'src/start_point/point.service';
import { Types } from 'mongoose';
import { UpdatePointInterface } from 'src/start_point/dtos/update-point.dto';

describe('PointService', () => {
  let service: PointService;
  let mockPointModel: any;
  let mockHttpService: any;

  beforeEach(async () => {
    mockPointModel = {
      create: jest.fn().mockImplementation((dto) => dto),
      findById: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
      bulkWrite: jest.fn(),
    };

    mockHttpService = {
      get: jest.fn(),
      patch: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointService,
        {
          provide: getModelToken('Point'),
          useValue: mockPointModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<PointService>(PointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      jest.spyOn(service, 'validateTokenAndGetUserId').mockResolvedValue(null);

      await expect(
        service.create(
          { name: 'Test Point', description: 'Description' },
          'invalid-token',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('create', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      const createStartPointDto = {
        name: 'Test Point',
        description: 'Description',
      };
      const token = 'invalid-token';

      jest.spyOn(service, 'validateTokenAndGetUserId').mockResolvedValue(null);

      await expect(service.create(createStartPointDto, token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('addPointToUser', () => {
    it('should call the user service to add the point', async () => {
      const userId = 'user-id';
      const pointId = 'point-id';
  
      // Simula uma resposta bem-sucedida do patch
      jest.spyOn(mockHttpService, 'patch').mockReturnValue(of({}));
  
      await service.addPointToUser(userId, pointId);
  
      expect(mockHttpService.patch).toHaveBeenCalledWith(
        `${process.env.USER_SERVICE_URL}/${userId}/add-point`,
        { pointId }
      );
    });
  
  });

  describe('update', () => {
    it('should update a point and return the updated point', async () => {
      const updateStartPointDto = {
        name: 'Updated Test Point',
        description: 'Updated Description',
      };
      const updatedPoint = { _id: 'point-id', ...updateStartPointDto };
      mockPointModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(updatedPoint),
      });

      const result = await service.update('point-id', updateStartPointDto);

      expect(result).toEqual(updatedPoint);
      expect(mockPointModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'point-id',
        updateStartPointDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if point does not exist', async () => {
      mockPointModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('invalid-point-id', {
          name: '',
          description: '',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addJourneyToPoint', () => {
    it('should throw NotFoundException if point does not exist', async () => {
      mockPointModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addJourneyToPoint('invalid-point-id', 'journey-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getJourneysByPointId', () => {
    it('should return an array of journey IDs associated with a point', async () => {
      const point = {
        _id: 'point-id',
        name: 'Test Point',
        journeys: ['journey-id'],
      };
      mockPointModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(point),
      });

      const result = await service.getJourneysByPointId('point-id');

      expect(result).toEqual(['journey-id']);
      expect(mockPointModel.findById).toHaveBeenCalledWith('point-id');
    });

    it('should throw NotFoundException if point does not exist', async () => {
      mockPointModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.getJourneysByPointId('invalid-point-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of points', async () => {
      const points = [{ name: 'Test Point', description: 'Description' }];
      mockPointModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(points),
      });

      const result = await service.findAll();
      expect(result).toEqual(points);
      expect(mockPointModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a point by id', async () => {
      const point = {
        _id: 'point-id',
        name: 'Test Point',
        description: 'Description',
      };
      mockPointModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(point),
      });

      const result = await service.findById('point-id');
      expect(result).toEqual(point);
      expect(mockPointModel.findById).toHaveBeenCalledWith('point-id');
    });

    it('should throw NotFoundException if point does not exist', async () => {
      mockPointModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('invalid-point-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a point and return it', async () => {
      const point = {
        _id: 'point-id',
        name: 'Test Point',
        description: 'Description',
      };
      mockPointModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(point),
      });

      const result = await service.delete('point-id');
      expect(result).toEqual(point);
      expect(mockPointModel.findByIdAndDelete).toHaveBeenCalledWith('point-id');
    });

    it('should throw NotFoundException if point does not exist', async () => {
      mockPointModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('invalid-point-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validateTokenAndGetUserId', () => {
    it('should return userId if token is valid', async () => {
      const token = 'valid-token';
      mockHttpService.get.mockReturnValue(
        of({ data: { userPayload: { id: 'valid-user-id' } } }),
      );

      const userId = await service.validateTokenAndGetUserId(token);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        `${process.env.AUTH_SERVICE_URL}/validate-token`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      expect(userId).toBe('valid-user-id');
    });

    it('should return null if token is invalid', async () => {
      const token = 'invalid-token';
      mockHttpService.get.mockReturnValue(of({ data: {} }));

      const userId = await service.validateTokenAndGetUserId(token);

      expect(userId).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return an array of points for the given userId', async () => {
      const points = [
        { _id: 'point-id-1', name: 'Point 1', user: 'user-id' },
        { _id: 'point-id-2', name: 'Point 2', user: 'user-id' },
      ];
      mockPointModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(points),
      });

      const result = await service.findByUserId('user-id');

      expect(result).toEqual(points);
      expect(mockPointModel.find).toHaveBeenCalledWith({ user: 'user-id' });
    });
  });

  describe('addJourneyToPoint', () => {
    it('should add a journey to the point and return the updated point', async () => {
      const pointId = new Types.ObjectId().toHexString(); // Use um ID válido para o ponto
      const journeyId = new Types.ObjectId().toHexString(); // Use um ID válido para a jornada
      const objectId = new Types.ObjectId(journeyId);

      const point = {
        _id: pointId,
        name: 'Test Point',
        journeys: [],
        save: jest.fn().mockResolvedValue({
          _id: pointId,
          name: 'Test Point',
          journeys: [objectId],
        }),
      };

      mockPointModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(point),
      });

      const result = await service.addJourneyToPoint(pointId, journeyId);

      expect(result).toEqual({
        _id: pointId,
        name: 'Test Point',
        journeys: [objectId],
      });
      expect(mockPointModel.findById).toHaveBeenCalledWith(pointId);
      expect(point.journeys).toContainEqual(objectId); // Use toContainEqual aqui
      expect(point.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if point does not exist', async () => {
      const pointId = new Types.ObjectId().toHexString(); // Use um ID válido para o ponto
      const journeyId = new Types.ObjectId().toHexString(); // Use um ID válido para a jornada

      mockPointModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addJourneyToPoint(pointId, journeyId),
      ).rejects.toThrow(NotFoundException);
      expect(mockPointModel.findById).toHaveBeenCalledWith(pointId);
    });
  });

  describe('updateOrder', () => {
    it('should perform bulk updates and return the result', async () => {
      const id1 = new Types.ObjectId();
      const id2 = new Types.ObjectId();

      const journeys: UpdatePointInterface[] = [
        {
          _id: id1.toHexString(),
          order: 1,
          name: 'Point A',
          __v: 0,
          createdAt: '',
          updatedAt: '',
        },
        {
          _id: id2.toHexString(),
          order: 2,
          name: 'Point B',
          __v: 0,
          createdAt: '',
          updatedAt: '',
        },
      ];

      const bulkOperations = journeys.map((trail) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(trail._id) },
          update: { $set: { order: trail.order } },
        },
      }));

      const result = { modifiedCount: 2, matchedCount: 2 };
      mockPointModel.bulkWrite.mockResolvedValue(result);

      const response = await service.updateOrder(journeys);

      expect(mockPointModel.bulkWrite).toHaveBeenCalledWith(bulkOperations);
      expect(response).toEqual(result);
    });
  });
});
