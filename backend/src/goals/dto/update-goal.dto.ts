import {
    IsString,
    IsNumber,
    IsDateString,
    IsEnum,
    IsOptional,
  } from 'class-validator';
  import { GoalTypeDto } from './create-goal.dto';
  
  export class UpdateGoalDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsEnum(GoalTypeDto)
    goalType?: GoalTypeDto;
  
    @IsOptional()
    @IsNumber()
    targetAmount?: number;
  
    @IsOptional()
    @IsDateString()
    targetDate?: string;
  
    @IsOptional()
    @IsNumber()
    assumedReturnPa?: number;
  
    @IsOptional()
    @IsString()
    riskProfile?: string;
  }
  