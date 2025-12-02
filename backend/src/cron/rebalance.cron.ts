// src/cron/rebalance.cron.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RebalanceCron {
  private readonly logger = new Logger(RebalanceCron.name);

  constructor(private readonly prisma: PrismaService) {}

  // Runs every night at 1 AM
  @Cron('0 1 * * *')
  async checkPortfolioDeviation() {
    this.logger.log('Checking portfolio rebalance deviations...');

    const portfolios = await this.prisma.portfolio.findMany({
      include: { client: true },
    });

    for (const p of portfolios) {
      // Use client's AUM as current portfolio size
      const aum = p.client.aum;
      const riskLevel = p.client.riskLevel;

      // Simple heuristic target AUM based on risk level
      let targetAum = 10_00_000; // 10L default

      if (riskLevel === 'HIGH') targetAum = 20_00_000;
      if (riskLevel === 'LOW') targetAum = 5_00_000;

      const deviation = Math.abs(aum - targetAum) / targetAum;

      if (deviation > 0.15) {
        const percent = Math.round(deviation * 100);
        const message = `Portfolio deviated by ${percent}%. Rebalance recommended.`;

        await this.prisma.alert.create({
          data: {
            clientId: p.clientId,
            severity: percent > 25 ? 'HIGH' : 'MEDIUM',
            message,
          },
        });

        this.logger.warn(
          `Rebalance alert for client ${p.clientId}: ${percent}% deviation`,
        );
      }
    }

    this.logger.log('Rebalance deviation check completed.');
  }
}
