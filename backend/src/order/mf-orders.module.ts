// src/order/order.module.ts
import { Module } from '@nestjs/common';
import { MfOrdersService } from './mf-orders.service';
import { MfOrdersController } from './mf-orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BrokerModule } from '../broker/broker.module';

@Module({
  imports: [BrokerModule],
  providers: [MfOrdersService, PrismaService],
  controllers: [MfOrdersController],
  exports: [MfOrdersService],
})
export class OrdersModule {}
