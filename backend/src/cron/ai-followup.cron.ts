import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { CrmService } from '../crm/crm.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class AiFollowupCron {
  private readonly logger = new Logger(AiFollowupCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly crmService: CrmService,
  ) {}

  // Run every day at 9 AM server time
  @Cron('0 9 * * *')
  async handleDailyFollowups() {
    this.logger.log('Running AI auto-followup cron');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueTasks = await this.prisma.task.findMany({
      where: {
        status: TaskStatus.PENDING,
        dueAt: {
          gte: today,
          lt: tomorrow,
        },
        clientId: {
          not: null,
        },
      },
      include: {
        client: true,
      },
    });

    for (const task of dueTasks) {
      if (!task.client) continue;

      try {
        await this.crmService.sendAICampaign(task.client.id, 'FOLLOW_UP');

        await this.prisma.task.update({
          where: { id: task.id },
          data: { status: TaskStatus.IN_PROGRESS },
        });
      } catch (err) {
        this.logger.error(
          `Failed to send AI follow-up for task ${task.id}`,
          err.stack,
        );
      }
    }
  }
}
