import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MockMutualFundBroker } from './mock-mutual-fund-broker.service';
import { BseStarMutualFundBroker } from './bse-star-mutual-fund-broker.service';

// Use BSE Star if credentials are configured, otherwise fall back to mock
const useRealBroker = !!(
  process.env.BSE_STAR_API_KEY && process.env.BSE_STAR_API_SECRET
);

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'MutualFundBroker',
      useClass: useRealBroker ? BseStarMutualFundBroker : MockMutualFundBroker,
    },
  ],
  exports: ['MutualFundBroker'],
})
export class BrokerModule {}
