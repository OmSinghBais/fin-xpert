// hooks/useClientDashboard.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ClientDashboardData,
  Loan,
  Goal,
  LoanOptimizationSuggestion,
  AuditLogEntry,
  LoanStatus,
} from '@/lib/types';
import {
  getClientDashboard,
  getTaxOptimization,   // uses /clients/{id}/portfolio/tax-optimization
  updateLoanStatus,
} from '@/lib/api';


export function useClientDashboard(clientId: string) {
  const [data, setData] = useState<ClientDashboardData | null>(null);
  const [optimizations, setOptimizations] = useState<
    LoanOptimizationSuggestion[]
  >([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!clientId) return;

    try {
      setLoading(true);
      setError(null);

      // ---- 1. Get raw client from /clients/:id ----
      const raw = await getClientDashboard(clientId);

      // client may be root or wrapped in { client: ... }
      const client = (raw as any).client ?? raw;

      // loans could be at several places depending on backend:
      const loans: Loan[] =
        (raw as any).loans ??
        (raw as any).loanApplications ??
        (client as any).loans ??
        (client as any).loanApplications ??
        [];

      // goals likewise:
      const goals: Goal[] =
        (raw as any).goals ??
        (client as any).goals ??
        [];

      // ---- 2. Compute metrics (or use backend-provided ones if present) ----
      let {
        totalLoanExposure,
        activeLoansCount,
        activeGoalsCount,
        avgGoalProgress,
      } = raw as Partial<ClientDashboardData>;

      if (
        totalLoanExposure == null ||
        activeLoansCount == null ||
        activeGoalsCount == null ||
        avgGoalProgress == null
      ) {
        const activeLoans = loans.filter(
          (l) => l.status === 'APPROVED' || l.status === 'DISBURSED',
        );
        const activeGoals = goals.filter((g) => g.status === 'ACTIVE');

        totalLoanExposure =
          activeLoans.reduce((sum, l) => sum + (l.amount ?? 0), 0) ?? 0;

        activeLoansCount = activeLoans.length;
        activeGoalsCount = activeGoals.length;

        avgGoalProgress =
          goals.length > 0
            ? goals.reduce(
                (sum, g) =>
                  sum +
                  ((g.currentAmount ?? 0) /
                    Math.max(g.targetAmount ?? 1, 1)) *
                    100,
                0,
              ) / goals.length
            : 0;
      }

      const dashboard: ClientDashboardData = {
        client,
        loans,
        goals,
        totalLoanExposure: totalLoanExposure ?? 0,
        activeLoansCount: activeLoansCount ?? 0,
        activeGoalsCount: activeGoalsCount ?? 0,
        avgGoalProgress: avgGoalProgress ?? 0,
      };

      setData(dashboard);
      let opt: LoanOptimizationSuggestion[] = [];
      try {
        opt = await getTaxOptimization(clientId);
      } catch (e: any) { /* ... */ }
      setOptimizations(opt);
      
      // ---- 4. Audit logs ----
      let logs: AuditLogEntry[] = [];
      try {
        logs = await getAuditLogs(clientId);
      } catch (e: any) {
        const msg = String(e?.message ?? '');
        if (!msg.includes('404')) console.error('audit log error', e);
      }
      setAuditLogs(logs);
      // ---- 3. Optimization suggestions (mapped to tax-optimization endpoint) ----
      let opt: LoanOptimizationSuggestion[] = [];
      try {
        opt = await getTaxOptimization(clientId);
      } catch (e: any) {
        const msg = String(e?.message ?? '');
        if (!msg.includes('404')) console.error('tax optimization error', e);
      }
      setOptimizations(opt);

      // ---- 4. Audit logs (no backend route yet → keep empty) ----
      setAuditLogs([]); // placeholder; wire to real /audit-logs route if/when it exists
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? 'Failed to load client dashboard');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  // ---- 5. Real loan status change (PATCH /loans/:id/status) ----
  const changeLoanStatus = useCallback(
    async (loanId: string, status: LoanStatus, note?: string) => {
      if (!loanId || !status) return;
      try {
        setActionLoading(true);
        setError(null);
        await updateLoanStatus(loanId, status, note);
        await load(); // refresh dashboard after update
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? 'Failed to update loan status');
      } finally {
        setActionLoading(false);
      }
    },
    [load],
  );




  return {
    data,
    optimizations,
    auditLogs,
    loading,
    actionLoading,
    error,
    reload: load,
    changeLoanStatus,
  };
}
