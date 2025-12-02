import { DistributionChannel, TransactionType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PlaceOrderDto {
  @IsString()
  productId: string;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  txnType: TransactionType;

  @IsOptional()
  @IsEnum(DistributionChannel)
  channel?: DistributionChannel;
}
