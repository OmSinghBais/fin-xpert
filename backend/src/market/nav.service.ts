import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class NavService {
  private readonly logger = new Logger(NavService.name);
  private readonly AMFI_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';

  constructor(private readonly prisma: PrismaService) {}

  async syncLatestNav() {
    this.logger.log('Fetching AMFI NAV file...');

    const { data } = await axios.get(this.AMFI_URL, {
      responseType: 'text',
    });

    const lines = data.split('\n');
    this.logger.log(`Total lines from AMFI: ${lines.length}`);

    let inserted = 0;
    let skipped = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        skipped++;
        continue;
      }

      // Skip header
      if (trimmed.startsWith('Scheme Code')) {
        skipped++;
        continue;
      }

      const parts = trimmed.split(';');

      // AMFI sometimes changes columns slightly.
      // We only hard-require: schemeCode, schemeName, nav, date.
      if (parts.length < 5) {
        skipped++;
        continue;
      }

      const schemeCode = parts[0]?.trim();
      const isin1 = parts[1]?.trim() || null;
      const schemeName = parts[3]?.trim();
      const navRaw = parts[4]?.trim();

      // navDate is usually at index 7 but sometimes last column
      const navDateStr = parts[7]?.trim() || parts[parts.length - 1]?.trim();

      if (!schemeCode || !schemeName || !navRaw || !navDateStr) {
        skipped++;
        continue;
      }

      const nav = parseFloat(navRaw);
      if (isNaN(nav)) {
        skipped++;
        continue;
      }

      const date = new Date(navDateStr);
      if (isNaN(date.getTime())) {
        skipped++;
        continue;
      }

      // Avoid duplicates for same scheme + date
      const existing = await this.prisma.mutualFundNav.findFirst({
        where: {
          schemeCode,
          navDate: date,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await this.prisma.mutualFundNav.create({
        data: {
          schemeCode,
          isin: isin1,
          schemeName,
          nav,
          navDate: date,
          source: 'AMFI',
        },
      });

      inserted++;
    }

    this.logger.log(
      `NAV sync completed. Inserted=${inserted}, Skipped=${skipped}`,
    );

    return { inserted, skipped };
  }
}
