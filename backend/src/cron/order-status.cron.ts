import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MfOrdersService } from '../order/mf-orders.service';

@Injectable()
export class OrderStatusCron {
  private readonly logger = new Logger(OrderStatusCron.name);

  constructor(private readonly mfOrdersService: MfOrdersService) {}

  // Every 5 minutes
  @Cron('*/5 * * * *')
  async syncOrders() {
    this.logger.log('Syncing pending MF orders...');
    const res = await this.mfOrdersService.syncPendingOrders();
    this.logger.log(`Updated ${res.updated} orders`);
  }
}
