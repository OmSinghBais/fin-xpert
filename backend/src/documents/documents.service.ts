import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Express } from 'express';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(clientId: string, type: string, file: Express.Multer.File) {
    // TODO: Replace with real Cloudinary / S3 upload
    const cloudUrl = await this.uploadToCloud(file);

    return this.prisma.document.create({
      data: {
        clientId,
        type,
        url: cloudUrl,
      },
    });
  }

  async getClientDocuments(clientId: string) {
    return this.prisma.document.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async uploadToCloud(file: Express.Multer.File): Promise<string> {
    // Stub – replace with real cloud integration
    return `https://cloud.example.com/${file.originalname}`;
  }
}
