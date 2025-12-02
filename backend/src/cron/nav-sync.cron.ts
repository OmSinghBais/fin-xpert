import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MarketService } from '../market/market.service';

@Injectable()
export class NavSyncCron {
  private readonly logger = new Logger(NavSyncCron.name);

  // Every night 11:30 PM
  @Cron('30 23 * * *')
  async handleNavSync() {
    this.logger.log('Running nightly NAV sync...');
    const res = await this.marketService.syncMutualFundNav();
    this.logger.log(`NAV sync complete: inserted ${res.inserted} rows`);
  }

  constructor(private readonly marketService: MarketService) {}
}
