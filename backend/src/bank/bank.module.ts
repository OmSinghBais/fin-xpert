import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    PrismaModule,   // ✅ PrismaService
    AiModule,       // ✅ GeminiService
  ],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
