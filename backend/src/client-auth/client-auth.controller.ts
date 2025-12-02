import { Body, Controller, Post } from '@nestjs/common';
import { ClientAuthService } from './client-auth.service';

@Controller('client-auth')
export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  @Post('login')
  login(
    @Body() body: { phone: string; password: string },
  ) {
    return this.clientAuthService.login(body.phone, body.password);
  }
}
