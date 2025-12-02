import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { BankService } from './bank.service';
  import type { Express } from 'express';

  
  @Controller('bank')
  export class BankController {
    constructor(private readonly bankService: BankService) {}
  
    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async importStatement(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      return this.bankService.importStatement(file);
    }
  }
  