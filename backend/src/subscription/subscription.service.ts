// src/subscription/subscription.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveSubscription(advisorId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        advisorId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { expiresAt: 'desc' },
    });
  }

  async ensurePro(advisorId: string) {
    const sub = await this.getActiveSubscription(advisorId);
    if (!sub || (sub.plan !== 'PRO' && sub.plan !== 'ENTERPRISE')) {
      throw new ForbiddenException('Pro plan required for this feature');
    }
  }
}
