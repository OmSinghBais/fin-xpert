import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SipReminderCron {
  private readonly logger = new Logger(SipReminderCron.name);

  constructor(private readonly prisma: PrismaService) {}

  // ✅ Runs every morning at 9 AM
  @Cron('0 9 * * *')
  async sendSipReminders() {
    const today = new Date().getDate();

    const sipPlans = await this.prisma.sipPlan.findMany({
      where: { dayOfMonth: today },
      include: { client: true },
    });

    for (const sip of sipPlans) {
      const msg = `Reminder: Your SIP of ₹${sip.amount} is scheduled for today.`;

      // ✅ Email / WhatsApp Hook
      console.log(`📱 WhatsApp to ${sip.client.phone}: ${msg}`);
      console.log(`📧 Email to ${sip.client.name}: ${msg}`);

      this.logger.log(`SIP reminder sent to ${sip.clientId}`);
    }
  }
}
