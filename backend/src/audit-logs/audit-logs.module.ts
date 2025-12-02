import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],          // gives PrismaService
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],      // ✅ REQUIRED for LoansModule & AuditModule
})
export class AuditLogsModule {}
