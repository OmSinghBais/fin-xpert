// src/broker/mutual-fund-broker.interface.ts
export interface PlaceOrderPayload {
  clientId: string;
  schemeCode: string;
  isin?: string;
  amount: number;
  orderType: 'BUY' | 'SELL' | 'SIP';
}

export type BrokerOrderStatus = 'INITIATED' | 'PENDING' | 'ALLOTTED' | 'FAILED';

export interface BrokerOrderResponse {
  broker: string;
  externalOrderId: string;
  status: BrokerOrderStatus;
  message?: string;
}

export interface MutualFundBroker {
  placeOrder(payload: PlaceOrderPayload): Promise<BrokerOrderResponse>;
  getOrderStatus(externalOrderId: string): Promise<BrokerOrderResponse>;
  cancelOrder(externalOrderId: string): Promise<BrokerOrderResponse>;
}
