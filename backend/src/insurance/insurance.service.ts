import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InsuranceService {
  constructor(private readonly prisma: PrismaService) {}

  async estimatePremium(input: {
    productId: string;
    age: number;
    smoker: boolean;
    sumAssured: number;
    tenureYears: number;
  }) {
    const product = await this.prisma.insuranceProduct.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw new Error('Insurance product not found');
    }

    const base = product.basePremium;
    const ageFactor = 1 + Math.max(0, input.age - 30) * 0.02; // +2% per year above 30
    const smokerFactor = input.smoker ? 1.5 : 1.0;
    const coverFactor = input.sumAssured / product.baseSum;

    const premium = base * ageFactor * smokerFactor * coverFactor;

    return {
      monthlyPremium: Math.round(premium),
    };
  }

  async createProposal(input: {
    clientId: string;
    productId: string;
    age: number;
    smoker: boolean;
    sumAssured: number;
    tenureYears: number;
  }) {
    const product = await this.prisma.insuranceProduct.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw new Error('Insurance product not found');
    }

    const est = await this.estimatePremium(input);

    return this.prisma.insuranceProposal.create({
      data: {
        clientId: input.clientId,
        productId: input.productId,
        insurer: product.insurer,
        sumAssured: input.sumAssured,
        tenureYears: input.tenureYears,
        age: input.age,
        smoker: input.smoker,
        premiumMonthly: est.monthlyPremium,
      },
    });
  }
}
