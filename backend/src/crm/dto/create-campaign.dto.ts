import { ChannelType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ChannelType)
  channel: ChannelType;

  @IsOptional()
  filterJson?: any;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
