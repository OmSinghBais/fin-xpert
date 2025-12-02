import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SipMandateStatus } from '@prisma/client';

@Injectable()
export class SipMandatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMandate(input: {
    clientId: string;
    bankAccount: string;
    amount: number;
    frequency: string;
  }) {
    // for now, pretend we request mandate and it becomes PENDING
    return this.prisma.sipMandate.create({
      data: {
        clientId: input.clientId,
        bankAccount: input.bankAccount,
        debitAmount: input.amount,
        frequency: input.frequency,
        status: SipMandateStatus.PENDING,
      },
    });
  }

  async listMandates(clientId: string) {
    return this.prisma.sipMandate.findMany({ where: { clientId } });
  }

  // later: hook actual bank/NPCI APIs here
}
