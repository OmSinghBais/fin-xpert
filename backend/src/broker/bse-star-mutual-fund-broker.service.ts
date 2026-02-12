import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  MutualFundBroker,
  PlaceOrderPayload,
  BrokerOrderResponse,
} from './mutual-fund-broker.interface';

/**
 * BSE Star Mutual Fund Broker Integration
 * This service integrates with BSE Star MF platform for placing orders
 */
@Injectable()
export class BseStarMutualFundBroker implements MutualFundBroker {
  private readonly logger = new Logger(BseStarMutualFundBroker.name);
  private readonly baseUrl =
    process.env.BSE_STAR_API_URL || 'https://api.bse-star.com';
  private readonly apiKey = process.env.BSE_STAR_API_KEY;
  private readonly apiSecret = process.env.BSE_STAR_API_SECRET;

  constructor(private readonly httpService: HttpService) {}

  async placeOrder(payload: PlaceOrderPayload): Promise<BrokerOrderResponse> {
    try {
      // Validate API credentials
      if (!this.apiKey || !this.apiSecret) {
        this.logger.warn('BSE Star API credentials not configured, using mock');
        return this.mockPlaceOrder(payload);
      }

      // Prepare order request
      const orderRequest = {
        schemeCode: payload.schemeCode,
        isin: payload.isin,
        amount: payload.amount,
        orderType: payload.orderType,
        clientId: payload.clientId,
      };

      // Call BSE Star API
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/api/v1/orders`, orderRequest, {
          headers: {
            'X-API-Key': this.apiKey,
            'X-API-Secret': this.apiSecret,
            'Content-Type': 'application/json',
          },
        }),
      );

      return {
        broker: 'BSE_STAR',
        externalOrderId: response.data.orderId,
        status: 'PENDING',
        message: 'Order placed successfully',
      };
    } catch (error) {
      this.logger.error('BSE Star order placement failed:', error);

      // Fallback to mock in case of API failure
      if (process.env.NODE_ENV !== 'production') {
        this.logger.warn('Falling back to mock order');
        return this.mockPlaceOrder(payload);
      }

      throw error;
    }
  }

  async getOrderStatus(externalOrderId: string): Promise<BrokerOrderResponse> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        return this.mockGetOrderStatus(externalOrderId);
      }

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/api/v1/orders/${externalOrderId}`,
          {
            headers: {
              'X-API-Key': this.apiKey,
              'X-API-Secret': this.apiSecret,
            },
          },
        ),
      );

      return {
        broker: 'BSE_STAR',
        externalOrderId,
        status: this.mapStatus(response.data.status),
        message: response.data.message || 'Order status retrieved',
      };
    } catch (error) {
      this.logger.error('BSE Star order status check failed:', error);

      if (process.env.NODE_ENV !== 'production') {
        return this.mockGetOrderStatus(externalOrderId);
      }

      throw error;
    }
  }

  async cancelOrder(externalOrderId: string): Promise<BrokerOrderResponse> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        return {
          broker: 'BSE_STAR',
          externalOrderId,
          status: 'FAILED',
          message: 'API credentials not configured',
        };
      }

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/v1/orders/${externalOrderId}/cancel`,
          {},
          {
            headers: {
              'X-API-Key': this.apiKey,
              'X-API-Secret': this.apiSecret,
            },
          },
        ),
      );

      return {
        broker: 'BSE_STAR',
        externalOrderId,
        status: 'FAILED',
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      this.logger.error('BSE Star order cancellation failed:', error);
      throw error;
    }
  }

  private mapStatus(status: string): BrokerOrderResponse['status'] {
    const statusMap: Record<string, BrokerOrderResponse['status']> = {
      INITIATED: 'INITIATED',
      PENDING: 'PENDING',
      ALLOTTED: 'ALLOTTED',
      EXECUTED: 'ALLOTTED',
      FAILED: 'FAILED',
      CANCELLED: 'FAILED',
    };
    return statusMap[status] || 'PENDING';
  }

  private mockPlaceOrder(payload: PlaceOrderPayload): BrokerOrderResponse {
    return {
      broker: 'BSE_STAR',
      externalOrderId: `BSE-${Date.now()}`,
      status: 'PENDING',
      message: 'Mock order placed (BSE Star credentials not configured)',
    };
  }

  private mockGetOrderStatus(externalOrderId: string): BrokerOrderResponse {
    // Simulate random success/failure for testing
    const success = Math.random() > 0.1;
    return {
      broker: 'BSE_STAR',
      externalOrderId,
      status: success ? 'ALLOTTED' : 'PENDING',
      message: success ? 'Order executed (mock)' : 'Order pending (mock)',
    };
  }
}
