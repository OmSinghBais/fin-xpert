import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getClientSnapshot(clientId: string) {
    const positions = await this.prisma.portfolioPosition.findMany({
      where: { clientId },
    });

    if (positions.length === 0) {
      return { totalValue: 0, positions: [] };
    }

    const isins = [...new Set(positions.map((p) => p.isin))];

    const latestNavs = await this.prisma.mutualFundNav.findMany({
      where: { isin: { in: isins } },
      orderBy: { navDate: 'desc' },
    });

    const navMap = new Map<string, number>();
    for (const nav of latestNavs) {
      if (nav.isin && !navMap.has(nav.isin)) {
        navMap.set(nav.isin, nav.nav);
      }
    }

    let totalValue = 0;
    const enriched = positions.map((p) => {
      const nav = navMap.get(p.isin) ?? 0;
      const currentValue = p.units * nav;
      totalValue += currentValue;
      const invested = p.units * p.avgPrice;
      const gain = currentValue - invested;
      const gainPct = invested ? (gain / invested) * 100 : 0;

      return {
        ...p,
        nav,
        currentValue,
        invested,
        gain,
        gainPct,
      };
    });

    return { totalValue, positions: enriched };
  }
}
