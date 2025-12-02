import { Module } from '@nestjs/common';
import { MockMutualFundBroker } from './mock-mutual-fund-broker.service';

@Module({
  providers: [
    {
      provide: 'MutualFundBroker',
      useClass: MockMutualFundBroker, // swap to BseStarMutualFundBroker later
    },
  ],
  exports: ['MutualFundBroker'],
})
export class BrokerModule {}
