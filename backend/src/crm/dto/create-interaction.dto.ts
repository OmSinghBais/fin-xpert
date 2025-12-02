import {
    ChannelType,
    DirectionType,
    InteractionType,
  } from '@prisma/client';
  import { IsEnum, IsOptional, IsString } from 'class-validator';
  
  export class CreateInteractionDto {
    @IsString()
    clientId: string;
  
    @IsOptional()
    @IsString()
    advisorId?: string;
  
    @IsEnum(InteractionType)
    type: InteractionType;
  
    @IsEnum(ChannelType)
    channel: ChannelType;
  
    @IsEnum(DirectionType)
    direction: DirectionType;
  
    @IsOptional()
    @IsString()
    subject?: string;
  
    @IsString()
    content: string;
  }
  