import { Controller, Get, Post } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('nav-test')
  testNav() {
    return this.marketService.testFetchNav();
  }

  // allow both GET and POST
  @Get('nav-sync')
  getNavSync() {
    return this.marketService.syncMutualFundNav();
  }

  @Post('nav-sync')
  postNavSync() {
    return this.marketService.syncMutualFundNav();
  }
}
