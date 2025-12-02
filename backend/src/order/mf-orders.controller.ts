import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MfOrdersService } from './mf-orders.service';

@Controller('orders/mutual-funds')
export class MfOrdersController {
  constructor(private readonly mfOrdersService: MfOrdersService) {}

  @Post('buy')
  placeBuy(@Body() body: { clientId: string; schemeCode: string; isin?: string; amount: number }) {
    return this.mfOrdersService.placeBuyOrder(body);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.mfOrdersService.getOrderById(id);
  }
}
