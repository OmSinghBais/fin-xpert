import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    AuditLogsModule,
    AiModule,          // ✅ GeminiService now comes from AiModule
  ],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService],
})
export class LoansModule {}
