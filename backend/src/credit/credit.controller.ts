// src/credit/credit.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { CreditService } from './credit.service';

@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  // GET /api/credit/clients/:id/summary
  @Get('clients/:id/summary')
  getSummary(@Param('id') id: string) {
    return this.creditService.getCreditSummary(id);
  }
}
