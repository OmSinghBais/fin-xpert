import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { ProductType } from '@prisma/client';

@Controller('distribution')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  // --------- Products ---------

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.distributionService.createProduct(dto);
  }

  @Get('products')
  listProducts(
    @Query('type') type?: ProductType,
    @Query('enabledOnly') enabledOnly?: string,
  ) {
    return this.distributionService.listProducts({
      type,
      enabledOnly: enabledOnly === 'true',
    });
  }

  // --------- Orders / Transactions ---------

  @Post('clients/:clientId/orders')
  placeOrder(@Param('clientId') clientId: string, @Body() dto: PlaceOrderDto) {
    return this.distributionService.placeOrder({
      clientId,
      ...dto,
    });
  }

  @Get('clients/:clientId/transactions')
  getClientTransactions(@Param('clientId') clientId: string) {
    return this.distributionService.getClientTransactions(clientId);
  }
}
