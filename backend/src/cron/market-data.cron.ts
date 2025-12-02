// src/cron/market-data.cron.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MarketDataService } from '../market/market-data.service'; // 👈 from market module

@Injectable()
export class MarketDataCron {
  private readonly logger = new Logger(MarketDataCron.name);

  constructor(private readonly marketDataService: MarketDataService) {}

  // Every night at 11:30 PM
  @Cron('30 23 * * *')
  async handleMarketSync() {
    this.logger.log('Running nightly market data sync...');
    await this.marketDataService.syncMarketData();
  }
}
