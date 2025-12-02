// src/ai-usage/ai-usage.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiUsageService } from './ai-usage.service';

@Module({
  imports: [PrismaModule],
  providers: [AiUsageService],
  exports: [AiUsageService],  // so other modules (like AiModule) can inject it
})
export class AiUsageModule {}

