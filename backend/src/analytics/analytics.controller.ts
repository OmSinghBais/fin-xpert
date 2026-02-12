import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('advisor-dashboard')
  getAdvisorDashboard(@Query('advisorId') advisorId: string) {
    if (!advisorId) {
      throw new BadRequestException('advisorId is required');
    }
    return this.analyticsService.getAdvisorDashboard(advisorId);
  }
}
