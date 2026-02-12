import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsEnum(ProductType)
  type: ProductType;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  riskLevel?: string;

  @IsOptional()
  @IsNumber()
  minInvestment?: number;
}
