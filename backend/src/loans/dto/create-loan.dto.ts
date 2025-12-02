import { IsString, IsNumber, IsInt, IsOptional, Min } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  clientId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsInt()
  @Min(1)
  tenureMonths: number;

  @IsNumber()
  @Min(0)
  interestRate: number; // % p.a.

  @IsOptional()
  @IsString()
  purpose?: string;
}
