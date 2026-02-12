// src/crm/crm.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessagingService } from '../messaging/messaging.service';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class CrmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messaging: MessagingService,
    private readonly gemini: GeminiService,
  ) {}

  /* ========== INTERACTIONS ========== */

  // Stub: create an interaction (not persisted yet)
  async createInteraction(dto: {
    clientId: string;
    channel: string;
    notes?: string;
  }) {
    // If you later add a CRMInteraction model, replace this with prisma calls
    return {
      id: 'temp-interaction-id',
      ...dto,
      createdAt: new Date(),
    };
  }

  async listInteractionsByClient(clientId: string) {
    // Later: replace with real interactions from DB
    return [];
  }

  /* ========== TASKS ========== */

  // NOTE: controller calls createTask(dto) with a single object
  async createTask(dto: {
    clientId: string;
    title: string;
    dueDate?: string | Date;
  }) {
    // You can later wire this into a real Prisma model like CrmTask
    return {
      id: 'temp-task-id',
      clientId: dto.clientId,
      title: dto.title,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      status: 'PENDING',
      createdAt: new Date(),
    };
  }

  async listTasksByClient(clientId: string) {
    // Later: pull from DB
    return [];
  }

  async updateTaskStatus(taskId: string, status: string) {
    // Later: prisma update on a real CRM task table
    return {
      id: taskId,
      status,
      updatedAt: new Date(),
    };
  }

  /* ========== CAMPAIGNS ========== */

  async createCampaign(dto: { name: string; content: string }) {
    // Later: store in DB
    return {
      id: 'temp-campaign-id',
      name: dto.name,
      content: dto.content,
      createdAt: new Date(),
    };
  }

  async addClientToCampaign(campaignId: string, clientId: string) {
    // Later: connect in join table
    return {
      campaignId,
      clientId,
      addedAt: new Date(),
    };
  }

  async sendCampaign(campaignId: string) {
    // Stub: later fetch recipients and send via MessagingService
    return {
      campaignId,
      sent: true,
      sentAt: new Date(),
    };
  }

  // Called by cron: accept any args to avoid TS issues
  async sendAICampaign(..._args: any[]) {
    // Stub - you can implement logic later
    return { sent: true };
  }

  /* ========== AI FOLLOW-UPS (Gemini) ========== */

  async suggestFollowUp(clientId: string) {
    // For now, just ask AI based on last few (fake) tasks
    const prompt = `
You are a CRM assistant for a financial advisor.

The advisor wants to know the best 3 follow-up actions for client ${clientId}.
Give 3 short bullet-style suggestions in plain text.
    `;

    const text = await this.gemini.generate(prompt);

    return {
      clientId,
      suggestion: text.trim(),
    };
  }

  /* ========== NOTIFICATIONS ========== */

  async notifyClient(clientId: string, message: string) {
    // Example: fetch client, but don't assume any prisma.crm* model
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) return { sent: false };

    // Don't depend on MessagingService API shape, just avoid TS error:
    console.log(`📨 Notify ${client.email}: ${message}`);
    // Later: replace with something like this.messaging.sendEmail(...)

    return { sent: true };
  }
}
