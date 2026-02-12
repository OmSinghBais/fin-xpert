import { Body, Controller, Post } from '@nestjs/common';
import { InsuranceService } from './insurance.service';

@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insurance: InsuranceService) {}

  @Post('estimate')
  estimate(
    @Body()
    body: {
      productId: string;
      age: number;
      smoker: boolean;
      sumAssured: number;
      tenureYears: number;
    },
  ) {
    return this.insurance.estimatePremium(body);
  }

  @Post('proposals')
  createProposal(
    @Body()
    body: {
      clientId: string;
      productId: string;
      age: number;
      smoker: boolean;
      sumAssured: number;
      tenureYears: number;
    },
  ) {
    return this.insurance.createProposal(body);
  }
}
