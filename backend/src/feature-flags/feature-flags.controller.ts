// src/feature-flags/feature-flags.controller.ts
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';

@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly ffService: FeatureFlagsService) {}

  @Get()
  list() {
    return this.ffService.listFlags();
  }

  @Patch()
  setFlag(@Body() body: { name: string; enabled: boolean }) {
    return this.ffService.setFlag(body.name, body.enabled);
  }
}
