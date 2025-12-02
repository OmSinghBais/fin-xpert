import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [InsuranceService, PrismaService],
  controllers: [InsuranceController],
})
export class InsuranceModule {}
