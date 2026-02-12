import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PortfolioHealthCron } from './portfolio-health.cron';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AiModule, // ✅ gives GeminiService to CRON
  ],
  providers: [PortfolioHealthCron],
})
export class CronModule {}
