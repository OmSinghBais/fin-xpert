import { TaskPriority } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  advisorId?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
