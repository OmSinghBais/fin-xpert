import {
    IsString,
    IsNumber,
    IsDateString,
    IsEnum,
    IsOptional,
  } from 'class-validator';
  
  export enum GoalTypeDto {
    RETIREMENT = 'RETIREMENT',
    EDUCATION = 'EDUCATION',
    WEALTH_CREATION = 'WEALTH_CREATION',
    CAR = 'CAR',
    HOUSE = 'HOUSE',
    OTHER = 'OTHER',
  }
  
  export class CreateGoalDto {
    @IsString()
    clientId: string;
  
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsEnum(GoalTypeDto)
    goalType: GoalTypeDto;
  
    @IsNumber()
    targetAmount: number;
  
    @IsDateString()
    targetDate: string;
  
    @IsNumber()
    assumedReturnPa: number;
  
    @IsOptional()
    @IsString()
    riskProfile?: string; // Conservative | Moderate | Aggressive
  }
  