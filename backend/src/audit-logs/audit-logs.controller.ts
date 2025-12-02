import { Controller, Get, Param } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AuditLogs')
@Controller('clients/:clientId/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  getClientLogs(@Param('clientId') clientId: string) {
    return this.auditLogsService.getForClient(clientId);
  }
}
