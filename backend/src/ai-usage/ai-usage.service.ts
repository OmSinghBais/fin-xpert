// src/ai-usage/ai-usage.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiUsageService {
  constructor(private readonly prisma: PrismaService) {}

  async recordUsage(params: {
    advisorId: string;
    feature: string;
    tokens: number;
    cost: number;
  }) {
    return this.prisma.aiUsage.create({
      data: params,
    });
  }
}
