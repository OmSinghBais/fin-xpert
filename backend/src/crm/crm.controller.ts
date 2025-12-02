// src/crm/crm.controller.ts
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrmService } from './crm.service';

@ApiTags('CRM')
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // Interactions
  @Post('interactions')
  createInteraction(
    @Body()
    body: { clientId: string; channel: string; notes?: string },
  ) {
    return this.crmService.createInteraction(body);
  }

  @Get('interactions/:clientId')
  getInteractions(@Param('clientId') clientId: string) {
    return this.crmService.listInteractionsByClient(clientId);
  }

  // Tasks
  @Post('tasks')
  createTask(
    @Body()
    body: { clientId: string; title: string; dueDate?: string | Date },
  ) {
    return this.crmService.createTask(body);
  }

  @Get('tasks/:clientId')
  getTasks(@Param('clientId') clientId: string) {
    return this.crmService.listTasksByClient(clientId);
  }

  @Patch('tasks/:taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Query('status') status: string,
  ) {
    return this.crmService.updateTaskStatus(taskId, status);
  }

  // Campaigns
  @Post('campaigns')
  createCampaign(@Body() body: { name: string; content: string }) {
    return this.crmService.createCampaign(body);
  }

  @Post('campaigns/:campaignId/clients/:clientId')
  addClientToCampaign(
    @Param('campaignId') campaignId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.crmService.addClientToCampaign(campaignId, clientId);
  }

  @Post('campaigns/:campaignId/send')
  sendCampaign(@Param('campaignId') campaignId: string) {
    return this.crmService.sendCampaign(campaignId);
  }
}
