import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController, ClientGoalsController } from './goals.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GoalsController, ClientGoalsController],
  providers: [GoalsService, PrismaService],
  exports: [GoalsService],
})
export class GoalsModule {}
