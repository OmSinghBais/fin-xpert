// src/loans/loans.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, LoanStatus } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class LoansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
    private readonly gemini: GeminiService,
  ) {}

  // ✅ UPDATE LOAN STATUS + AUDIT LOG
  async updateStatus(
    loanId: string,
    status: LoanStatus,
    note?: string,
    advisorId?: string,
  ) {
    const loan = await this.prisma.loanApplication.update({
      where: { id: loanId },
      data: { status },
      include: { client: true },
    });

    await this.auditLogs.create({
      clientId: loan.clientId,
      advisorId,
      entityType: 'LOAN',
      entityId: loan.id,
      action: 'STATUS_CHANGED',
      message: `Loan status changed to ${status}`,
      meta: { status, note },
    });

    return loan;
  }

  // ✅ AI LOAN OPTIMIZATION USING GEMINI
  async getLoanOptimization(clientId: string) {
    const loans = await this.prisma.loanApplication.findMany({
      where: { clientId },
    });

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    const prompt = `
You are a senior Indian loan advisor AI.

CLIENT:
${JSON.stringify(client, null, 2)}

LOANS:
${JSON.stringify(loans, null, 2)}

Return ONLY JSON:
[
  { "title": string, "description": string, "impact": "HIGH" | "MEDIUM" | "LOW" }
]
`;

    const raw = await this.gemini.generate(prompt);

    try {
      return JSON.parse(
        raw
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim(),
      );
    } catch {
      return [
        {
          title: 'AI Parsing Failed',
          description: raw,
          impact: 'LOW',
        },
      ];
    }
  }

  // ✅ ADMIN LOAN LIST
  async listAdmin(status?: string) {
    const where: Prisma.LoanApplicationWhereInput = {};

    if (status) {
      where.status = status as LoanStatus;
    }

    return this.prisma.loanApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAllAdmin(status?: string) {
    return this.listAdmin(status);
  }

  // ✅ LOAN TIMELINE
  async getTimeline(loanId: string) {
    const loan = await this.prisma.loanApplication.findUnique({
      where: { id: loanId },
      include: {
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!loan) throw new NotFoundException('Loan not found');

    return loan.statusHistory;
  }

  // ✅ ADMIN APPROVE
  async approve(loanId: string, dto?: any, actor = 'SYSTEM') {
    return this.prisma.$transaction(async (tx) => {
      const loan = await tx.loanApplication.findUnique({
        where: { id: loanId },
      });

      if (!loan) throw new NotFoundException('Loan not found');

      const updated = await tx.loanApplication.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.APPROVED,
          approvedAmount: loan.amount,
          statusHistory: {
            create: {
              fromStatus: loan.status,
              toStatus: LoanStatus.APPROVED,
              comment: dto?.reason ?? 'Approved via admin',
              changedBy: actor,
            },
          },
        },
      });

      await this.auditLogs.create({
        clientId: loan.clientId,
        advisorId: undefined,
        entityType: 'LOAN',
        entityId: loan.id,
        action: 'APPROVED',
        message: 'Loan approved',
      });

      return updated;
    });
  }

  // ✅ ADMIN REJECT
  async reject(loanId: string, dto?: any, actor = 'SYSTEM') {
    return this.prisma.$transaction(async (tx) => {
      const loan = await tx.loanApplication.findUnique({
        where: { id: loanId },
      });

      if (!loan) throw new NotFoundException('Loan not found');

      const updated = await tx.loanApplication.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.REJECTED,
          statusHistory: {
            create: {
              fromStatus: loan.status,
              toStatus: LoanStatus.REJECTED,
              comment: dto?.reason ?? 'Rejected via admin',
              changedBy: actor,
            },
          },
        },
      });

      await this.auditLogs.create({
        clientId: loan.clientId,
        entityType: 'LOAN',
        entityId: loan.id,
        action: 'REJECTED',
        message: 'Loan rejected',
      });

      return updated;
    });
  }

  // ✅ ADMIN DISBURSE
  async disburse(loanId: string, actor = 'SYSTEM') {
    return this.prisma.$transaction(async (tx) => {
      const loan = await tx.loanApplication.findUnique({
        where: { id: loanId },
      });

      if (!loan) throw new NotFoundException('Loan not found');

      const updated = await tx.loanApplication.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.DISBURSED,
          disbursedAt: new Date(),
          statusHistory: {
            create: {
              fromStatus: loan.status,
              toStatus: LoanStatus.DISBURSED,
              comment: 'Disbursed',
              changedBy: actor,
            },
          },
        },
      });

      await this.auditLogs.create({
        clientId: loan.clientId,
        entityType: 'LOAN',
        entityId: loan.id,
        action: 'DISBURSED',
        message: 'Loan disbursed',
      });

      return updated;
    });
  }

  // ✅ ADMIN CLOSE
  async close(loanId: string, actor = 'SYSTEM') {
    return this.prisma.$transaction(async (tx) => {
      const loan = await tx.loanApplication.findUnique({
        where: { id: loanId },
      });

      if (!loan) throw new NotFoundException('Loan not found');

      const updated = await tx.loanApplication.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.CLOSED,
          statusHistory: {
            create: {
              fromStatus: loan.status,
              toStatus: LoanStatus.CLOSED,
              comment: 'Closed',
              changedBy: actor,
            },
          },
        },
      });

      await this.auditLogs.create({
        clientId: loan.clientId,
        entityType: 'LOAN',
        entityId: loan.id,
        action: 'CLOSED',
        message: 'Loan closed',
      });

      return updated;
    });
  }

  // ✅ CRON AUTO-APPROVAL
  async autoApprovePendingLoans(limit: number) {
    const pending = await this.prisma.loanApplication.findMany({
      where: { status: LoanStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    for (const loan of pending) {
      await this.approve(
        loan.id,
        { reason: 'Auto-approved by system' },
        'SYSTEM_CRON',
      );
    }

    return { processed: pending.length };
  }
}
