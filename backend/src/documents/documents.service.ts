import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import type { Express } from 'express';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {
    // Initialize Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
      api_key: process.env.CLOUDINARY_API_KEY || 'demo',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
    });
  }

  async upload(clientId: string, type: string, file: Express.Multer.File) {
    if (!file) {
      throw new InternalServerErrorException('No file provided');
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new InternalServerErrorException(
        `File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new InternalServerErrorException('File size exceeds 10MB limit');
    }

    try {
      const cloudUrl = await this.uploadToCloudinary(file, clientId, type);

      return this.prisma.document.create({
        data: {
          clientId,
          type,
          url: cloudUrl,
        },
      });
    } catch (error) {
      console.error('Document upload error:', error);
      throw new InternalServerErrorException('Failed to upload document');
    }
  }

  async getClientDocuments(clientId: string) {
    return this.prisma.document.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(documentId: string, clientId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, clientId },
    });

    if (!document) {
      throw new InternalServerErrorException('Document not found');
    }

    // Delete from Cloudinary
    try {
      const publicId = this.extractPublicIdFromUrl(document.url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      // Continue with database deletion even if Cloudinary delete fails
    }

    return this.prisma.document.delete({
      where: { id: documentId },
    });
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    clientId: string,
    type: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `finxpert/documents/${clientId}`,
          resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
          public_id: `${type}-${Date.now()}`,
          format: file.mimetype === 'application/pdf' ? undefined : 'jpg',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload succeeded but no URL returned'));
          }
        },
      );

      // Convert buffer to stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const matches = url.match(/\/([^/]+)\.[^.]+$/);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }
}
