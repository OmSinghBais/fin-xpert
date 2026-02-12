// src/crm/crm.module.ts
import { Module } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MessagingModule } from '../messaging/messaging.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    PrismaModule, // ✅ PrismaService
    MessagingModule, // ✅ MessagingService
    AiModule, // ✅ GeminiService (THIS fixes your error)
  ],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
