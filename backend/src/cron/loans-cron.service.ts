import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoansService } from '../loans/loans.service';

@Injectable()
export class LoansCronService {
  constructor(private readonly loansService: LoansService) {}

  @Cron('*/1 * * * *') // every 1 minute
  async handleAutoApproval() {
    await this.loansService.autoApprovePendingLoans(10);
  }
}
