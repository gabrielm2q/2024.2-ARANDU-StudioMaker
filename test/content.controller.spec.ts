import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from '../src/content/content.controller';
import { ContentService } from '../src/content/content.service';
import { CreateContentDto } from '../src/content/dtos/create-content.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('ContentController', () => {
  let controller: ContentController;
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [
        {
          provide: ContentService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContentController>(ContentController);
    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should throw UnauthorizedException if no token is provided', async () => {
      const dto: CreateContentDto = { title: 'Test', body: 'Test body' };
      const req = { headers: { authorization: '' } } as any;

      await expect(controller.create(dto, req)).rejects.toThrow(UnauthorizedException);
    });

    it('should call service.create with correct parameters', async () => {
      const dto: CreateContentDto = { title: 'Test', body: 'Test body' };
      const req = { headers: { authorization: 'Bearer token' } } as any;
      const result = { ...dto, id: '1' };

      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(dto, req)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto, 'token');
    });
  });

  describe('findAll', () => {
    it('should return an array of contents', async () => {
      const result = [{ id: '1', title: 'Test', body: 'Test body' }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return a single content', async () => {
      const result = { id: '1', title: 'Test', body: 'Test body' };

      jest.spyOn(service, 'findById').mockResolvedValue(result as any);

      expect(await controller.findById('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const dto: CreateContentDto = { title: 'Updated Test', body: 'Updated body' };
      const result = { ...dto, id: '1' };

      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update('1', dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });
});
