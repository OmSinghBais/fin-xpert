// src/order/mf-orders.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  MutualFundBroker,
  PlaceOrderPayload,
} from '../broker/mutual-fund-broker.interface';
import { MfOrderStatus, MfOrderType } from '@prisma/client';

@Injectable()
export class MfOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('MutualFundBroker')
    private readonly broker: MutualFundBroker,
  ) {}

  async placeBuyOrder(input: {
    clientId: string;
    schemeCode: string;
    isin?: string;
    amount: number;
  }) {
    // 1. create INITIATED in DB
    const order = await this.prisma.mutualFundOrder.create({
      data: {
        clientId: input.clientId,
        schemeCode: input.schemeCode,
        isin: input.isin,
        amount: input.amount,
        type: MfOrderType.BUY,
        status: MfOrderStatus.INITIATED,
        broker: 'MOCK',
      },
    });

    // 2. call broker
    const payload: PlaceOrderPayload = {
      clientId: input.clientId,
      schemeCode: input.schemeCode,
      isin: input.isin,
      amount: input.amount,
      orderType: 'BUY',
    };

    const resp = await this.broker.placeOrder(payload);

    // 3. update DB to PENDING (or FAILED)
    const updated = await this.prisma.mutualFundOrder.update({
      where: { id: order.id },
      data: {
        externalOrderId: resp.externalOrderId,
        status:
          resp.status === 'FAILED'
            ? MfOrderStatus.FAILED
            : MfOrderStatus.PENDING,
        errorMessage: resp.message ?? null,
      },
    });

    return updated;
  }

  async getOrderById(id: string) {
    return this.prisma.mutualFundOrder.findUnique({ where: { id } });
  }

  // Called by cron to move PENDING -> ALLOTTED/FAILED
  async syncPendingOrders(): Promise<{ updated: number }> {
    const pending = await this.prisma.mutualFundOrder.findMany({
      where: {
        status: MfOrderStatus.PENDING,
        externalOrderId: { not: null },
      },
    });

    let updated = 0;

    for (const order of pending) {
      const resp = await this.broker.getOrderStatus(order.externalOrderId!);

      if (resp.status === 'ALLOTTED' || resp.status === 'FAILED') {
        await this.prisma.mutualFundOrder.update({
          where: { id: order.id },
          data: {
            status:
              resp.status === 'ALLOTTED'
                ? MfOrderStatus.ALLOTTED
                : MfOrderStatus.FAILED,
            errorMessage: resp.message ?? null,
          },
        });
        updated++;
      }
    }

    return { updated };
  }
}
