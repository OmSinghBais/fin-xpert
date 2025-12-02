import { Injectable } from '@nestjs/common';
import {
  MutualFundBroker,
  PlaceOrderPayload,
  BrokerOrderResponse,
} from './mutual-fund-broker.interface';

@Injectable()
export class MockMutualFundBroker implements MutualFundBroker {
  async placeOrder(payload: PlaceOrderPayload): Promise<BrokerOrderResponse> {
    // simulate instant pending → will later get ALLOTTED by cron
    return {
      broker: 'MOCK',
      externalOrderId: 'MOCK-' + Date.now(),
      status: 'PENDING',
      message: 'Mock order placed',
    };
  }

  async getOrderStatus(externalOrderId: string): Promise<BrokerOrderResponse> {
    // super simple mock: randomly succeed/fail
    const success = Math.random() > 0.1;

    return {
      broker: 'MOCK',
      externalOrderId,
      status: success ? 'ALLOTTED' : 'FAILED',
      message: success ? 'Order executed' : 'Order failed (mock)',
    };
  }

  async cancelOrder(externalOrderId: string): Promise<BrokerOrderResponse> {
    return {
      broker: 'MOCK',
      externalOrderId,
      status: 'FAILED',
      message: 'Order cancelled (mock)',
    };
  }
}

