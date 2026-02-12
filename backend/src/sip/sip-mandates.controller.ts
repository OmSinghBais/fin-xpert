import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SipMandatesService } from './sip-mandates.service';

@Controller('sip/mandates')
export class SipMandatesController {
  constructor(private readonly sipService: SipMandatesService) {}

  @Post()
  create(
    @Body()
    body: {
      clientId: string;
      bankAccount: string;
      amount: number;
      frequency: string;
    },
  ) {
    return this.sipService.createMandate(body);
  }

  @Get(':clientId')
  list(@Param('clientId') clientId: string) {
    return this.sipService.listMandates(clientId);
  }
}
