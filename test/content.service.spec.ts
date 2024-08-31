import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { ContentService } from 'src/content/content.service';
import { TrailService } from 'src/trail/trail.service';

describe('ContentService', () => {
  let service: ContentService;

  const mockContentModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
  };

  const mockTrailModel = {
    findById: jest.fn(),
  };

  const mockTrailService = {
    addContentToTrail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getModelToken('Content'),
          useValue: mockContentModel,
        },
        {
          provide: getModelToken('Trail'),
          useValue: mockTrailModel,
        },
        {
          provide: TrailService,
          useValue: mockTrailService,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createContent', () => {
    it('should throw NotFoundException if trail does not exist', async () => {
      const contentDto = {
        title: 'Test Title',
        content: 'Test Content',
        trailId: 'invalid-trail-id',
      };

      mockTrailModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.createContent(
          contentDto.title,
          contentDto.content,
          contentDto.trailId,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findContentById', () => {
    it('should return content by id', async () => {
      const content = {
        _id: 'content-id',
        title: 'Test Title',
        content: 'Test Content',
      };
      mockContentModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(content),
      });

      const result = await service.findContentById('content-id');
      expect(result).toEqual(content);
      expect(mockContentModel.findById).toHaveBeenCalledWith('content-id');
    });

    it('should throw NotFoundException if content does not exist', async () => {
      mockContentModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findContentById('invalid-content-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllContents', () => {
    it('should return all contents', async () => {
      const contents = [
        { _id: 'content-id', title: 'Test Title', content: 'Test Content' },
      ];
      mockContentModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(contents),
      });

      const result = await service.findAllContents();
      expect(result).toEqual(contents);
      expect(mockContentModel.find).toHaveBeenCalled();
    });
  });

  describe('updateContent', () => {
    it('should update content and return the updated content', async () => {
      const content = {
        _id: 'content-id',
        title: 'Updated Title',
        content: 'Updated Content',
      };
      mockContentModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(content),
      });

      const result = await service.updateContent('content-id', {
        title: 'Updated Title',
        content: 'Updated Content',
      });
      expect(result).toEqual(content);
      expect(mockContentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'content-id',
        { title: 'Updated Title', content: 'Updated Content' },
        { new: true },
      );
    });

    it('should throw NotFoundException if content does not exist', async () => {
      mockContentModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateContent('invalid-content-id', { title: 'Updated Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteContent', () => {
    it('should delete content', async () => {
      mockContentModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({}),
      });

      await service.deleteContent('content-id');
      expect(mockContentModel.findByIdAndDelete).toHaveBeenCalledWith(
        'content-id',
      );
    });

    it('should throw NotFoundException if content does not exist', async () => {
      mockContentModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deleteContent('invalid-content-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findContentsByTrailId', () => {
    it('deve retornar uma lista de conteúdos quando a trilha for encontrada', async () => {
      const trailId = 'some-trail-id';
      const mockTrail = { _id: trailId, name: 'Test Trail' };
      const mockContents = [
        { _id: 'content1', title: 'Content 1', trail: trailId },
        { _id: 'content2', title: 'Content 2', trail: trailId },
      ];

      mockTrailModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockTrail),
      });

      mockContentModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockContents),
      });

      const result = await service.findContentsByTrailId(trailId);
      expect(result).toEqual(mockContents);
      expect(mockTrailModel.findById).toHaveBeenCalledWith(trailId);
      expect(mockContentModel.find).toHaveBeenCalledWith({ trail: trailId });
    });

    it('deve lançar uma exceção NotFoundException quando a trilha não for encontrada', async () => {
      const trailId = 'some-trail-id';

      mockTrailModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findContentsByTrailId(trailId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

});