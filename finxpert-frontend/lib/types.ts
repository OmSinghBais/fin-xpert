// lib/types.ts

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';

export type UserRole = 'ADMIN' | 'ADVISOR' | 'VIEWER';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  riskLevel?: string | null;       // "Conservative", etc.
  incomeMonthly?: number | null;   // optional so we don't crash
  aum?: number | null;
  // allow extra backend fields
  [key: string]: any;
}

export interface LoanStatusEvent {
  id: string;
  from?: LoanStatus | null;
  to: LoanStatus;
  note?: string | null;
  actorName?: string | null;
  actorRole?: UserRole | null;
  createdAt: string; // ISO string
}

export interface Loan {
  id: string;
  clientId?: string;
  amount: number;
  tenureMonths?: number;
  rateAnnual?: number;
  emi?: number;
  status: LoanStatus;
  statusTimeline?: LoanStatusEvent[];
  [key: string]: any;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  expectedReturnPercent?: number;
  status?: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | string;

  // Optional extra fields for SIP UI
  requiredSipMonthly?: number;
  mfAllocationNote?: string; // "30% Large Cap, 40% Mid Cap..."
  targetDate?: string;       // ISO or plain string

  // if backend uses other names, we still catch them
  mfScheme?: string;
  schemeName?: string;

  [key: string]: any;
}

export interface ClientDashboardData {
  client: Client;
  loans: Loan[];
  goals: Goal[];
  totalLoanExposure?: number;
  activeLoansCount?: number;
  activeGoalsCount?: number;
  avgGoalProgress?: number;
}

export interface LoanOptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impactLabel: string;
}

export interface AuditLogEntry {
  id: string;
  createdAt: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details?: string;
}
