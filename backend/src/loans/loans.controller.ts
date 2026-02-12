import { Controller, Get, Param, Post } from '@nestjs/common';
import { LoansService } from './loans.service';

@Controller()
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  // GET /api/loans/:id/timeline
  @Get('loans/:id/timeline')
  getTimeline(@Param('id') id: string) {
    return this.loansService.getTimeline(id);
  }
  @Get('clients/:clientId/loan-optimization')
  getLoanOptimization(@Param('clientId') clientId: string) {
    return this.loansService.getLoanOptimization(clientId);
  }

  // GET /api/admin/loans
  @Get('admin/loans')
  getAdminLoans() {
    return this.loansService.findAllAdmin();
  }

  // POST /api/admin/loans/:id/approve
  @Post('admin/loans/:id/approve')
  approve(@Param('id') id: string) {
    return this.loansService.approve(id);
  }
}
