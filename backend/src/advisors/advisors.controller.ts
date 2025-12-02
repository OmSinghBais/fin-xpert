import { Controller, Get } from '@nestjs/common';
import { AdvisorsService } from './advisors.service';

@Controller('advisors')
export class AdvisorsController {
  constructor(private readonly advisorsService: AdvisorsService) {}

  @Get()
  findAll() {
    return this.advisorsService.findAll();
  }
}
