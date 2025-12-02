import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DistributionChannel,
  FinancialProduct,
  ProductType,
  ProductTransaction,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { MfBrokerService } from '../broker/mf-broker.service';

@Injectable()
export class DistributionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mfBroker: MfBrokerService,
  ) {}

  // --------- Products ---------

  createProduct(data: {
    type: ProductType;
    name: string;
    code?: string;
    provider?: string;
    category?: string;
    riskLevel?: string;
    minInvestment?: number;
    metadata?: any;
  }): Promise<FinancialProduct> {
    return this.prisma.financialProduct.create({
      data: { ...data },
    });
  }

  listProducts(params?: { type?: ProductType; enabledOnly?: boolean }) {
    const where: any = {};
    if (params?.type) where.type = params.type;
    if (params?.enabledOnly) where.enabled = true;

    return this.prisma.financialProduct.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // --------- Orders / Transactions ---------

  async placeOrder(params: {
    clientId: string;
    productId: string;
    amount: number;
    txnType: TransactionType;
    channel?: DistributionChannel;
  }): Promise<ProductTransaction> {
    const { clientId, productId, amount, txnType, channel } = params;

    const [client, product] = await Promise.all([
      this.prisma.client.findUnique({ where: { id: clientId } }),
      this.prisma.financialProduct.findUnique({ where: { id: productId } }),
    ]);

    if (!client) throw new NotFoundException('Client not found');
    if (!product) throw new NotFoundException('Product not found');

    // ✅ Find or create portfolio
    let portfolio = await this.prisma.portfolio.findFirst({
      where: { clientId, productId },
    });

    if (!portfolio) {
      portfolio = await this.prisma.portfolio.create({
        data: {
          client: { connect: { id: clientId } },
          type: product.type,
          value: 0,
          product: product.name,
          productRef: { connect: { id: product.id } },
        },
      });
    }

    // ✅ 1. Create transaction as PENDING
    let transaction = await this.prisma.productTransaction.create({
      data: {
        client: { connect: { id: clientId } },
        portfolio: { connect: { id: portfolio.id } },
        product: { connect: { id: productId } },
        amount,
        txnType,
        channel: channel ?? DistributionChannel.ONLINE,
        status: TransactionStatus.PENDING,
      },
    });

    // ✅ 2. Call broker
    const brokerResult = await this.mfBroker.placeOrder({
      client,
      product,
      amount,
      txnType,
    });

    // ✅ 3. Update transaction
    transaction = await this.prisma.productTransaction.update({
      where: { id: transaction.id },
      data: {
        status: brokerResult.success
          ? TransactionStatus.SUCCESS
          : TransactionStatus.FAILED,
        externalRef: brokerResult.orderId,
        nav: brokerResult.nav ?? transaction.nav,
        units: brokerResult.units ?? transaction.units,
        rawResponse: brokerResult.raw ?? transaction.rawResponse,
      },
    });

    // ✅ 4. Update portfolio only on SUCCESS
    if (transaction.status === TransactionStatus.SUCCESS) {
      let newValue = portfolio.value;

      if (
        txnType === TransactionType.PURCHASE ||
        txnType === TransactionType.SIP_INSTALLMENT ||
        txnType === TransactionType.LOAN_DISBURSAL ||
        txnType === TransactionType.PREMIUM_PAYMENT
      ) {
        newValue += amount;
      } else if (
        txnType === TransactionType.REDEMPTION ||
        txnType === TransactionType.WITHDRAWAL ||
        txnType === TransactionType.LOAN_REPAYMENT
      ) {
        newValue -= amount;
      }

      await this.prisma.portfolio.update({
        where: { id: portfolio.id },
        data: { value: newValue },
      });
    }

    return transaction;
  }

  getClientTransactions(clientId: string) {
    return this.prisma.productTransaction.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
        portfolio: true,
      },
    });
  }
}
