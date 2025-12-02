// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { AdvisorsModule } from './advisors/advisors.module';
import { AuthModule } from './auth/auth.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { AiModule } from './ai/ai.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AlertsModule } from './alerts/alerts.module';
import { PortfolioHealthCron } from './cron/portfolio-health.cron';
import { RebalanceCron } from './cron/rebalance.cron';
import { SipReminderCron } from './cron/sip-reminder.cron';
import { BankModule } from './bank/bank.module';
import { MarketModule } from './market/market.module';
import { MarketDataCron } from './cron/market-data.cron';
import { CreditModule } from './credit/credit.module';
import { DocumentsModule } from './documents/documents.module';
import { ClientAuthModule } from './client-auth/client-auth.module';
import { ConsentModule } from './consent/consent.module';
import { AuditModule } from './audit/audit.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { GeminiService } from './ai/gemini.service';
// 🔹 new modules
import { MessagingModule } from './messaging/messaging.module';
import { CrmModule } from './crm/crm.module';
import { DistributionModule } from './distribution/distribution.module';
import { AiFollowupCron } from './cron/ai-followup.cron';
import { NavSyncCron } from './cron/nav-sync.cron';
import { BrokerModule } from './broker/broker.module';
import { SipModule } from './sip/sip.module';
import { OrdersModule } from './order/mf-orders.module';
import { InsuranceModule } from './insurance/insurance.module';
import { LoansModule } from './loans/loans.module';
import { LoansService } from './loans/loans.service';
import { GoalsModule } from './goals/goals.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    ClientsModule,
    AdvisorsModule,
    AuthModule,
    PortfoliosModule,
    AiModule,
    AnalyticsModule,
    AlertsModule,
    BankModule,
    MarketModule,
    CreditModule,
    DocumentsModule,
    ClientAuthModule,
    ConsentModule,
    AuditModule,
    FeatureFlagsModule,
    MessagingModule,
    CrmModule,
    DistributionModule,
    MarketModule,
    BrokerModule,
    SipModule,
    OrdersModule,
    InsuranceModule,
    LoansModule ,
    GoalsModule,
    AuditLogsModule
    
  ],
  controllers: [AppController],
  providers: [
    PortfolioHealthCron,
    RebalanceCron,
    SipReminderCron,
    MarketDataCron,
    AiFollowupCron,
   // NavSyncCron,
   GeminiService,
  ],
  exports: [GeminiService],
})
export class AppModule {}
