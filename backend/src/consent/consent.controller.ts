import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConsentService } from './consent.service';
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Post(':clientId')
  giveConsent(@Param('clientId') clientId: string, @Body('type') type: string) {
    return this.consentService.giveConsent(clientId, type);
  }

  @Get(':clientId')
  getConsents(@Param('clientId') clientId: string) {
    return this.consentService.getClientConsents(clientId);
  }
}
