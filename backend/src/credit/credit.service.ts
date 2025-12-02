// src/credit/credit.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditService {
  constructor(private readonly prisma: PrismaService) {}

  // Simple demo: return latest credit score check for client
  async getCreditSummary(clientId: string) {
    const latest = await this.prisma.creditScoreCheck.findFirst({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
      return {
        clientId,
        hasCheck: false,
        score: null,
        bureau: null,
      };
    }

    return {
      clientId,
      hasCheck: true,
      score: latest.score,
      bureau: latest.bureau,
      createdAt: latest.createdAt,
    };
  }
}
