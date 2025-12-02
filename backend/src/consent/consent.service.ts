import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}

  giveConsent(clientId: string, type: string) {
    return this.prisma.consent.create({
      data: { clientId, type },
    });
  }

  getClientConsents(clientId: string) {
    return this.prisma.consent.findMany({ where: { clientId } });
  }
}
