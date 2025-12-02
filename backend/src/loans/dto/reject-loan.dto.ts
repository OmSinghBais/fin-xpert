import { IsString } from 'class-validator';

export class RejectLoanDto {
  @IsString()
  reason: string;
}
