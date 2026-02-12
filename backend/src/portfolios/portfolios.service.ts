// src/portfolios/portfolios.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class PortfoliosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  // DATA HELPERS
  createPosition(
    clientId: string,
    data: { type: string; product: string; value: number },
  ) {
    return this.prisma.portfolio.create({
      data: {
        type: data.type,
        product: data.product,
        value: Number(data.value),
        client: { connect: { id: clientId } },
      },
    });
  }

  getClientPortfolio(clientId: string) {
    return this.prisma.portfolio.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  getClientTotalValue(clientId: string) {
    return this.prisma.portfolio.aggregate({
      where: { clientId },
      _sum: { value: true },
    });
  }

  // GEMINI CHAT
  async chat(clientId: string, message: string) {
    const positions = await this.getClientPortfolio(clientId);
    const totalObj = await this.getClientTotalValue(clientId);
    const total = totalObj._sum.value ?? 0;

    const prompt = `
You are a financial advisor AI.

CLIENT PORTFOLIO:
${
  positions.length === 0
    ? '(no holdings)'
    : positions.map((p) => `- ${p.type}, ${p.product}, ₹${p.value}`).join('\n')
}

TOTAL VALUE: ₹${total}

USER QUESTION:
${message}

Give a short, clear answer in plain text.
    `;

    const reply = await this.gemini.generate(prompt);
    return { reply: reply.trim(), clientId };
  }

  // GEMINI INSIGHTS
  async getInsights(clientId: string) {
    const positions = await this.getClientPortfolio(clientId);

    const prompt = `
Analyze this portfolio and give 3–5 bullet insights.
Return ONLY a JSON array of strings.

PORTFOLIO:
${
  positions.length === 0
    ? '(no holdings)'
    : positions.map((p) => `- ${p.type}, ${p.product}, ₹${p.value}`).join('\n')
}
    `;

    const raw = await this.gemini.generate(prompt);

    let insights: string[] = [];
    try {
      insights = JSON.parse(
        raw
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim(),
      );
    } catch {
      insights = [raw];
    }

    return { clientId, insights };
  }

  // TAX OPTIMIZATION (Gemini)
  async getTaxOptimization(clientId: string) {
    const positions = await this.getClientPortfolio(clientId);
    const totalObj = await this.getClientTotalValue(clientId);
    const total = totalObj._sum.value ?? 0;

    if (positions.length === 0 || total === 0) {
      return {
        clientId,
        totalValue: 0,
        message:
          'No investments found. Start investing to use tax-saving options under Indian tax law.',
        suggestions: [],
      };
    }

    const equityValue = positions
      .filter((p) => p.type === 'Stock' || p.type === 'MF' || p.type === 'ETF')
      .reduce((sum, p) => sum + p.value, 0);

    const prompt = `
You are a senior Indian tax planner.

Client Portfolio:
${positions.map((p) => `- ${p.type}, ${p.product}, ₹${p.value}`).join('\n')}

Total AUM: ₹${total}
Equity Exposure: ₹${equityValue}

Return STRICT JSON ONLY:
{
  "estimatedTaxEfficiency": "Low" | "Medium" | "High",
  "section80C": { "currentStatus": string, "suggestions": string[] },
  "capitalGainsStrategy": { "ltcgGuidance": string, "stcgGuidance": string },
  "taxLossHarvesting": { "opportunity": boolean, "guidance": string },
  "actionChecklist": string[],
  "advisorSummary": string
}
`;

    try {
      const aiText = await this.gemini.generate(prompt);
      const clean = aiText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(clean);

      return {
        clientId,
        totalValue: total,
        positionsCount: positions.length,
        ...parsed,
      };
    } catch (err) {
      console.error('❌ Tax Optimization AI Failed:', err);

      return {
        clientId,
        totalValue: total,
        positionsCount: positions.length,
        error: 'Tax optimization AI currently unavailable',
      };
    }
  }
}
