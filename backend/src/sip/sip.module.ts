import { Module } from '@nestjs/common';
import { SipMandatesService } from './sip-mandates.service';
import { SipMandatesController } from './sip-mandates.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SipMandatesService, PrismaService],
  controllers: [SipMandatesController],
})
export class SipModule {}
