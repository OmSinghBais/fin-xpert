// src/market/market-data.service.ts
import { Injectable } from '@nestjs/common';
import { MarketService } from './market.service';

@Injectable()
export class MarketDataService {
  constructor(private readonly marketService: MarketService) {}

  async syncMarketData() {
    // delegate to the NAV sync we already wrote
    return this.marketService.syncMutualFundNav();
  }
}
