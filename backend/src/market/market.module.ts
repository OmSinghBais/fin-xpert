import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MarketDataService } from './market-data.service';

@Module({
  imports: [HttpModule],
  controllers: [MarketController],
  providers: [MarketService, PrismaService, MarketDataService],
  exports: [MarketDataService],
})
export class MarketModule {}
