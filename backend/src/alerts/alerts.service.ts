// src/alerts/alerts.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  getAlerts() {
    return this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: true },
    });
  }
}
