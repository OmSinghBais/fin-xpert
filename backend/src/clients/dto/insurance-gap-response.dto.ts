// src/clients/dto/insurance-gap-response.dto.ts
export class InsuranceGapResponseDto {
    clientId: string;
    recommendedCover: number;
    currentInsurance: number;
    gap: number;
    isUnderInsured: boolean;
    explanation: string;
  }
  