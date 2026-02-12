// src/portfolios/portfolios.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Portfolios')
@Controller('clients/:clientId/portfolio')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  // ✅ CREATE POSITION
  @Post()
  addPosition(
    @Param('clientId') clientId: string,
    @Body() body: { type: string; product: string; value: number },
  ) {
    return this.portfoliosService.createPosition(clientId, {
      ...body,
      value: Number(body.value),
    });
  }

  // ✅ GET ALL POSITIONS
  @Get()
  getPositions(@Param('clientId') clientId: string) {
    return this.portfoliosService.getClientPortfolio(clientId);
  }

  // ✅ GET TOTAL VALUE
  @Get('total')
  async getTotal(@Param('clientId') clientId: string) {
    const result = await this.portfoliosService.getClientTotalValue(clientId);
    return { total: result._sum.value ?? 0 };
  }

  // ✅ AI TAX OPTIMIZATION
  @Get('tax-optimization')
  getTaxOptimization(@Param('clientId') clientId: string) {
    return this.portfoliosService.getTaxOptimization(clientId);
  }

  // ✅ SIMPLE CHAT (Gemini)
  @Post('chat')
  chat(@Param('clientId') clientId: string, @Body() body: { message: string }) {
    return this.portfoliosService.chat(clientId, body.message);
  }

  // ✅ SIMPLE INSIGHTS (Gemini)
  @Get('insights')
  getInsights(@Param('clientId') clientId: string) {
    return this.portfoliosService.getInsights(clientId);
  }
}
