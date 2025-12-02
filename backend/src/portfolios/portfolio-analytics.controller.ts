import { Controller, Get, Param } from '@nestjs/common';
import { PortfolioAnalyticsService } from './portfolio-analytics.service';

@Controller('clients')
export class PortfolioAnalyticsController {
  constructor(private readonly analytics: PortfolioAnalyticsService) {}

  @Get(':clientId/portfolio-snapshot')
  snapshot(@Param('clientId') clientId: string) {
    return this.analytics.getClientSnapshot(clientId);
  }
}
