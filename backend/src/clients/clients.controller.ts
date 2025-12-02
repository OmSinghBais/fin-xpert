import { Controller, Get, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // GET /api/clients
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  // GET /api/clients/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  // GET /api/clients/:id/loans
  @Get(':id/loans')
  getLoans(@Param('id') id: string) {
    return this.clientsService.getLoansForClient(id);
  }

  // GET /api/clients/:id/goals
  @Get(':id/goals')
  getGoals(@Param('id') id: string) {
    return this.clientsService.getGoalsForClient(id);
  }
}
