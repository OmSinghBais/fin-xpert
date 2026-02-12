import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  // List all clients for the /api/clients page
  async findAll() {
    return this.prisma.client.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Single client header info
  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        riskLevel: true,
        age: true,
        income: true,
        dependents: true,
        currentInsurance: true,
        aum: true,
        createdAt: true,
      },
    });
  }

  // Loans for client dashboard
  async getLoansForClient(clientId: string) {
    const loans = await this.prisma.loanApplication.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    return loans.map((l) => {
      const amount = Number(l.amount);
      const rate = Number(l.interestRate) / 100 / 12;
      const n = l.tenureMonths;

      let emi = l.emiAmount ? Number(l.emiAmount) : 0;
      if (!emi && rate > 0 && n > 0) {
        emi =
          (amount * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      }

      return {
        ...l,
        amount,
        interestRate: Number(l.interestRate),
        approvedAmount: l.approvedAmount ? Number(l.approvedAmount) : null,
        emiAmount: emi,
      };
    });
  }

  // Goals + MF recommendations for client dashboard
  async getGoalsForClient(clientId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: {
        recommendations: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return goals.map((g) => {
      const target = Number(g.targetAmount);
      const current = Number(g.currentAmount);
      const sip = g.requiredMonthlySip ? Number(g.requiredMonthlySip) : 0;
      const completionPercent = target > 0 ? (current / target) * 100 : 0;

      return {
        id: g.id,
        name: g.name,
        description: g.description,
        goalType: g.goalType,
        status: g.status,
        targetAmount: target,
        currentAmount: current,
        requiredMonthlySip: sip,
        assumedReturnPa: Number(g.assumedReturnPa),
        riskProfile: g.riskProfile,
        completionPercent,
        targetDate: g.targetDate,
        recommendations: g.recommendations.map((r) => ({
          id: r.id,
          schemeName: r.schemeName,
          allocationPercent: r.allocationPercent,
        })),
      };
    });
  }
}
