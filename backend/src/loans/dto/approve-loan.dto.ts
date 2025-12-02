import { IsNumber, IsOptional, Min } from 'class-validator';

export class ApproveLoanDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  approvedAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;
}
