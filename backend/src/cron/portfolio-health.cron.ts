// src/cron/portfolio-health.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class PortfolioHealthCron {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  // Runs every day at 2 AM
  @Cron('0 2 * * *')
  async run() {
    const clients = await this.prisma.client.findMany({
      select: { id: true },
    });

    for (const client of clients) {
      await this.evaluatePortfolioHealth(client.id);
    }
  }

  private async evaluatePortfolioHealth(clientId: string) {
    const positions = await this.prisma.portfolio.findMany({
      where: { clientId },
    });

    if (positions.length === 0) return;

    const totalValue = positions.reduce((s, p) => s + p.value, 0);

    const prompt = `
You are a senior portfolio risk system.

Client Holdings:
${positions.map((p) => `- ${p.type} ₹${p.value}`).join('\n')}

Total Value: ₹${totalValue}

Return a ONE-WORD health verdict only:
"Healthy" | "Moderate" | "HighRisk"
`;

    const verdict = (await this.gemini.generate(prompt)).trim();

    // Use portfolioAlert model via "any" to avoid strict type mismatch
    await (this.prisma as any).portfolioAlert.upsert({
      where: { clientId },
      update: {
        message: verdict,
        createdAt: new Date(),
      },
      create: {
        clientId,
        message: verdict,
        createdAt: new Date(),
      },
    });
  }
}
