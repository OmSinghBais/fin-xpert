import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdvisorDashboard(advisorId: string) {
    const [aumAgg, newClientsCount, riskBuckets, concentration] =
      await Promise.all([
        // Total AUM
        this.prisma.client.aggregate({
          _sum: { aum: true },
          where: { advisorId },
        }),

        // New clients this month
        this.prisma.client.count({
          where: {
            advisorId,
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),

        // Risk distribution
        this.prisma.client.groupBy({
          by: ['riskLevel'],
          where: { advisorId },
          _count: { _all: true },
        }),

        // Top concentration risks – simplistic: by client AUM
        this.prisma.client.findMany({
          where: { advisorId },
          select: { id: true, name: true, aum: true, riskLevel: true },
          orderBy: { aum: 'desc' },
          take: 5,
        }),
      ]);

    const totalAum = aumAgg._sum.aum ?? 0;

    return {
      totalAum,
      newClientsThisMonth: newClientsCount,
      riskDistribution: riskBuckets.map((b) => ({
        riskLevel: b.riskLevel,
        count: b._count._all,
      })),
      topConcentrationRisks: concentration,
    };
  }
}
