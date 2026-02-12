import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { Express } from 'express';

import { DocumentsService } from './documents.service';
@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private readonly docService: DocumentsService) {}

  @Post(':clientId')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('clientId') clientId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @CurrentUser() user: any,
  ) {
    if (!type) {
      throw new BadRequestException('Document type is required');
    }
    return this.docService.upload(clientId, type, file);
  }

  @Get(':clientId')
  getClientDocs(@Param('clientId') clientId: string) {
    return this.docService.getClientDocuments(clientId);
  }

  @Delete(':documentId/:clientId')
  deleteDocument(
    @Param('documentId') documentId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.docService.deleteDocument(documentId, clientId);
  }
}
