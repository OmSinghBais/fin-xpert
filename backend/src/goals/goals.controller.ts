import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Body() dto: CreateGoalDto) {
    return this.goalsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(id, dto);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.goalsService.cancel(id);
  }
}

@Controller('clients/:clientId/goals')
export class ClientGoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findByClient(@Param('clientId') clientId: string) {
    return this.goalsService.findByClient(clientId);
  }
}
