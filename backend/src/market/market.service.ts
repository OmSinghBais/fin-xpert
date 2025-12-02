import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private readonly navUrl =
    'https://portal.amfiindia.com/spages/NAVAll.txt';

  constructor(
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  // Just to verify we can reach AMFI + read the file
  async testFetchNav(): Promise<string> {
    try {
      const res: AxiosResponse<string> = await firstValueFrom(
        this.http.get<string>(this.navUrl, {
          responseType: 'text',
        }),
      );

      const text = res.data;
      return text.split('\n').slice(0, 5).join('\n');
    } catch (err) {
      this.logger.error('Error fetching NAV TXT', err);
      throw err;
    }
  }

  // Full sync: download file, parse, write to DB
  async syncMutualFundNav(): Promise<{ inserted: number }> {
    this.logger.log('Starting MutualFund NAV sync from AMFI…');

    const res: AxiosResponse<string> = await firstValueFrom(
      this.http.get<string>(this.navUrl, {
        responseType: 'text',
      }),
    );

    const raw = res.data || '';
    const lines = raw.split('\n');

    if (lines.length <= 1) {
      this.logger.warn('NAVAll.txt appears to be empty or header-only');
      return { inserted: 0 };
    }

    // skip header (line 0), ignore blank / malformed lines
    const data = lines
      .slice(1)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.split(';'))
      .filter((cols) => cols.length >= 6) // make sure all columns exist
      .map((cols) => {
        const schemeCode = cols[0].trim();
        const isin = cols[1]?.trim() || null;
        const schemeName = cols[3]?.trim() || '';
        const navStr = cols[4]?.trim();
        const dateStr = cols[5]?.trim();

        const nav = parseFloat(navStr);
        const navDate = dateStr ? new Date(dateStr) : new Date();

        return {
          schemeCode,
          isin,
          schemeName,
          nav,
          navDate,
          source: 'AMFI',
        };
      })
      .filter((row) => !Number.isNaN(row.nav) && !!row.schemeCode);

    this.logger.log(`Parsed ${data.length} NAV rows from AMFI`);

    if (data.length === 0) {
      return { inserted: 0 };
    }

    // Optional: clear old rows if you always want only latest NAV
    await this.prisma.mutualFundNav.deleteMany({});
    this.logger.log('Cleared old MutualFundNav rows');

    await this.prisma.mutualFundNav.createMany({
      data,
      skipDuplicates: true,
    });

    this.logger.log(`Inserted ${data.length} NAV rows into MutualFundNav`);

    return { inserted: data.length };
  }
}
