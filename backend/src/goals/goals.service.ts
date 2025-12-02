import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto, GoalTypeDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalStatus, GoalType } from '@prisma/client';

type RiskProfileKey = 'Conservative' | 'Moderate' | 'Aggressive';

const MODEL_PORTFOLIOS: Record<
  RiskProfileKey,
  { schemeName: string; allocationPercent: number }[]
> = {
  Conservative: [
    { schemeName: 'FinXpert Liquid Fund', allocationPercent: 30 },
    { schemeName: 'FinXpert Short Term Debt', allocationPercent: 50 },
    { schemeName: 'FinXpert Balanced Fund', allocationPercent: 20 },
  ],
  Moderate: [
    { schemeName: 'FinXpert Balanced Fund', allocationPercent: 40 },
    { schemeName: 'FinXpert Large Cap Equity', allocationPercent: 40 },
    { schemeName: 'FinXpert Mid Cap Equity', allocationPercent: 20 },
  ],
  Aggressive: [
    { schemeName: 'FinXpert Large Cap Equity', allocationPercent: 30 },
    { schemeName: 'FinXpert Mid Cap Equity', allocationPercent: 40 },
    { schemeName: 'FinXpert Small Cap Equity', allocationPercent: 30 },
  ],
};

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateMonthsToTarget(targetDate: Date): number {
    const now = new Date();
    if (targetDate <= now) return 1;
    const diffMs = targetDate.getTime() - now.getTime();
    const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30);
    return Math.max(1, Math.round(diffMonths));
  }

  private calculateMonthlySip(
    targetAmount: number,
    annualReturnPercent: number,
    months: number,
  ): number {
    const r = annualReturnPercent / 100 / 12;
    if (r <= 0) return targetAmount / months;
    const factor = Math.pow(1 + r, months) - 1;
    return (targetAmount * r) / factor;
  }

  private mapGoalType(dtoType: GoalTypeDto): GoalType {
    switch (dtoType) {
      case GoalTypeDto.RETIREMENT:
        return GoalType.RETIREMENT;
      case GoalTypeDto.EDUCATION:
        return GoalType.EDUCATION;
      case GoalTypeDto.WEALTH_CREATION:
        return GoalType.WEALTH_CREATION;
      case GoalTypeDto.CAR:
        return GoalType.CAR;
      case GoalTypeDto.HOUSE:
        return GoalType.HOUSE;
      default:
        return GoalType.OTHER;
    }
  }

  private getRiskProfileKey(riskProfile?: string): RiskProfileKey {
    if (!riskProfile) return 'Moderate';
    const upper = riskProfile.toLowerCase();
    if (upper.startsWith('con')) return 'Conservative';
    if (upper.startsWith('agg')) return 'Aggressive';
    return 'Moderate';
  }

  async create(dto: CreateGoalDto) {
    const targetDate = new Date(dto.targetDate);
    const months = this.calculateMonthsToTarget(targetDate);
    const requiredSip = this.calculateMonthlySip(
      dto.targetAmount,
      dto.assumedReturnPa,
      months,
    );

    const riskKey = this.getRiskProfileKey(dto.riskProfile);
    const modelPortfolio = MODEL_PORTFOLIOS[riskKey];

    return this.prisma.goal.create({
      data: {
        clientId: dto.clientId,
        name: dto.name,
        description: dto.description,
        goalType: this.mapGoalType(dto.goalType),
        targetAmount: dto.targetAmount,
        targetDate,
        assumedReturnPa: dto.assumedReturnPa,
        riskProfile: dto.riskProfile ?? riskKey,
        requiredMonthlySip: requiredSip,
        status: GoalStatus.ACTIVE,
        recommendations: {
          createMany: {
            data: modelPortfolio.map((p) => ({
              schemeName: p.schemeName,
              allocationPercent: p.allocationPercent,
            })),
          },
        },
      },
      include: {
        recommendations: true,
      },
    });
  }

  async findByClient(clientId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { clientId, status: { not: GoalStatus.CANCELLED } },
      orderBy: { createdAt: 'desc' },
    });

    return goals.map((g) => {
      const current = Number(g.currentAmount);
      const target = Number(g.targetAmount);
      const completionPercent =
        target > 0 ? Math.min(100, (current / target) * 100) : 0;

      return {
        ...g,
        completionPercent,
        onTrack: current >= target * 0.2, // dumb rule: at least 20% done
      };
    });
  }

  async findOne(id: string) {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: { recommendations: true, client: true },
    });
    if (!goal) return null;

    const current = Number(goal.currentAmount);
    const target = Number(goal.targetAmount);
    const completionPercent =
      target > 0 ? Math.min(100, (current / target) * 100) : 0;

    const now = new Date();
    const monthsLeft = this.calculateMonthsToTarget(goal.targetDate);
    const requiredSipNow = this.calculateMonthlySip(
      target - current,
      Number(goal.assumedReturnPa),
      monthsLeft,
    );

    return {
      ...goal,
      completionPercent,
      requiredLumpsumNow: target - current,
      requiredMonthlySipFromNow: requiredSipNow,
    };
  }

  async update(id: string, dto: UpdateGoalDto) {
    const existing = await this.prisma.goal.findUnique({ where: { id } });
    if (!existing) throw new Error('Goal not found');

    const targetDate = dto.targetDate
      ? new Date(dto.targetDate)
      : existing.targetDate;

    const targetAmount =
      dto.targetAmount !== undefined
        ? dto.targetAmount
        : Number(existing.targetAmount);

    const assumedReturnPa =
      dto.assumedReturnPa !== undefined
        ? dto.assumedReturnPa
        : Number(existing.assumedReturnPa);

    const months = this.calculateMonthsToTarget(targetDate);
    const requiredSip = this.calculateMonthlySip(
      targetAmount,
      assumedReturnPa,
      months,
    );

    return this.prisma.goal.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        description: dto.description ?? existing.description,
        goalType: dto.goalType
          ? this.mapGoalType(dto.goalType)
          : existing.goalType,
        targetAmount,
        targetDate,
        assumedReturnPa,
        riskProfile: dto.riskProfile ?? existing.riskProfile,
        requiredMonthlySip: requiredSip,
      },
    });
  }

  async cancel(id: string) {
    return this.prisma.goal.update({
      where: { id },
      data: { status: GoalStatus.CANCELLED },
    });
  }

  // Optional helper if you later want an endpoint to manually update currentAmount
  async updateCurrentAmount(id: string, newAmount: number) {
    return this.prisma.goal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
      },
    });
  }
}
