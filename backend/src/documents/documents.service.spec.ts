import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload a document successfully', async () => {
      const clientId = 'client-1';
      const type = 'PAN';
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test'),
      } as any;

      const mockDocument = {
        id: 'doc-1',
        clientId,
        type,
        url: 'https://cloudinary.com/test.pdf',
        createdAt: new Date(),
      };

      mockPrismaService.document.create.mockResolvedValue(mockDocument);

      // Mock Cloudinary upload (simplified for test)
      jest
        .spyOn(service as any, 'uploadToCloudinary')
        .mockResolvedValue('https://cloudinary.com/test.pdf');

      const result = await service.upload(clientId, type, mockFile);

      expect(result).toEqual(mockDocument);
      expect(mockPrismaService.document.create).toHaveBeenCalledWith({
        data: {
          clientId,
          type,
          url: 'https://cloudinary.com/test.pdf',
        },
      });
    });

    it('should throw error for invalid file type', async () => {
      const clientId = 'client-1';
      const type = 'PAN';
      const mockFile = {
        originalname: 'test.exe',
        mimetype: 'application/x-msdownload',
        size: 1024,
        buffer: Buffer.from('test'),
      } as any;

      await expect(service.upload(clientId, type, mockFile)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw error for file exceeding size limit', async () => {
      const clientId = 'client-1';
      const type = 'PAN';
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 11 * 1024 * 1024, // 11MB
        buffer: Buffer.from('test'),
      } as any;

      await expect(service.upload(clientId, type, mockFile)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getClientDocuments', () => {
    it('should return all documents for a client', async () => {
      const clientId = 'client-1';
      const mockDocuments = [
        {
          id: 'doc-1',
          clientId,
          type: 'PAN',
          url: 'https://cloudinary.com/pan.pdf',
          createdAt: new Date(),
        },
      ];

      mockPrismaService.document.findMany.mockResolvedValue(mockDocuments);

      const result = await service.getClientDocuments(clientId);

      expect(result).toEqual(mockDocuments);
      expect(mockPrismaService.document.findMany).toHaveBeenCalledWith({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
