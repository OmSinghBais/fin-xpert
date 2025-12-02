// src/audit/audit.module.ts
import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [AuditLogsModule],  // 👈 this gives AuditService access to AuditLogsService
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
