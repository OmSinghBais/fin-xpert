import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoanStatus } from '@prisma/client';
import { ApproveLoanDto } from './dto/approve-loan.dto';
import { RejectLoanDto } from './dto/reject-loan.dto';

@Controller('admin/loans')
export class AdminLoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  list(@Query('status') status?: LoanStatus) {
    return this.loansService.listAdmin(status);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body() dto: ApproveLoanDto) {
    // pass adminId from auth in real app
    return this.loansService.approve(id, dto, 'ADMIN_DEMO');
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectLoanDto) {
    return this.loansService.reject(id, dto, 'ADMIN_DEMO');
  }

  @Post(':id/disburse')
  disburse(@Param('id') id: string) {
    return this.loansService.disburse(id, 'ADMIN_DEMO');
  }

  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.loansService.close(id, 'ADMIN_DEMO');
  }
}
