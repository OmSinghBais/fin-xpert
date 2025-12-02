// src/audit-logs/audit-logs.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type AuditLogCreateInput = {
  clientId: string;
  advisorId?: string | null;
  entityType: string;
  entityId?: string | null;
  action: string;
  message: string;
  meta?: any;
};

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: AuditLogCreateInput) {
    const { advisorId, ...rest } = input;

    return this.prisma.auditLog.create({
      data: {
        ...rest,
        ...(advisorId ? { advisorId } : {}), // only set if present
      },
    });
  }

  getForClient(clientId: string) {
    return this.prisma.auditLog.findMany({
      where: { clientId }, // 👈 clientId now exists in the model
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
