// src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AuditService {
  constructor(private readonly auditLogs: AuditLogsService) {}

  /**
   * Convenience logger used by other modules.
   *
   * @param clientId   – affected client
   * @param advisorId  – who did the action (optional)
   * @param entityType – e.g. "LOAN" | "GOAL" | "CLIENT"
   * @param entityId   – optional entity id (loanId, goalId, etc.)
   */
  async log(params: {
    clientId: string;
    advisorId?: string;
    entityType: string;
    entityId?: string;
    action: string;
    message: string;
    meta?: any;
  }) {
    const { clientId, advisorId, entityType, entityId, action, message, meta } =
      params;

    return this.auditLogs.create({
      clientId,
      advisorId,
      entityType,
      entityId,
      action,
      message,
      meta,
    });
  }
}
