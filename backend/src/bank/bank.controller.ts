import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { BankService } from './bank.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { Express } from 'express';

@Controller('bank')
@UseGuards(AuthGuard('jwt'))
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('import/:clientId')
  @UseInterceptors(FileInterceptor('file'))
  async importStatement(
    @Param('clientId') clientId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} not allowed. Please upload PDF or Excel files.`,
      );
    }

    return this.bankService.importStatement(clientId, file);
  }
}
