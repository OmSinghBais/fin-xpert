// types/domain.ts

export type UserRole = 'ADMIN' | 'ADVISOR' | 'VIEWER';

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';

export interface LoanStatusEvent {
  id: string;
  from?: LoanStatus | null;
  to: LoanStatus;
  note?: string | null;
  actorId?: string | null;
  actorRole?: UserRole | 'SYSTEM' | null;
  createdAt: string; // ISO date
}

export interface Loan {
  id: string;
  clientId: string;
  amount: number;
  tenureMonths: number;
  rateAnnual: number;
  emi: number;
  status: LoanStatus;
  statusTimeline: LoanStatusEvent[];
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  requiredSip: number;
  mfAllocation: string[]; // or a richer object
  expectedReturn: number; // 0.13 = 13%
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  incomeMonthly: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  aum: number;
  loans: Loan[];
  goals: Goal[];
  createdAt: string;
}

export interface LoanOptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ClientLoanOptimizationResponse {
  clientId: string;
  suggestions: LoanOptimizationSuggestion[];
}

export interface MeResponse {
  id: string;
  name: string;
  role: UserRole;
}
