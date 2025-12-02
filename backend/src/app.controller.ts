import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { status: 'FinXpert backend is running ✅' };
  }
}
