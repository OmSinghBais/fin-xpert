// app/clients/[clientId]/page.tsx
'use client';

import { useParams } from 'next/navigation';

import { LoansTable } from '../../components/LoansTable';
import { ClientHealth } from '../../components/ClientHealth';
import { RiskAlerts } from '../../components/RiskAlerts';
import { LoanOptimizationPanel } from '../../components/LoanOptimizationPanel';
import { AuditLogTable } from '../../components/AuditLogTable';
import { GoalsTable } from '../../components/GoalsTable';
import { useClientDashboard } from '../../hooks/useClientDashboard';
import { UserRole } from '@/lib/types';

// TODO: wire from real auth later
const CURRENT_ROLE: UserRole = 'ADMIN';

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const {
    data,
    optimizations,
    auditLogs,
    loading,
    actionLoading,
    error,
    changeLoanStatus,
  } = useClientDashboard(clientId);

  if (loading && !data) {
    return <div className="p-6 text-gray-300">Loading client...</div>;
  }

  if (error && !data) {
    return (
      <div className="p-6 text-red-400">
        Failed to load client: {error}
      </div>
    );
  }

  if (!data) return null;

  const {
    client,
    loans,
    goals,
    totalLoanExposure,
    activeLoansCount,
    activeGoalsCount,
    avgGoalProgress,
  } = data;

  const incomeDisplay =
    client.incomeMonthly != null
      ? client.incomeMonthly.toLocaleString('en-IN')
      : 'N/A';

  const aumDisplay =
    client.aum != null ? client.aum.toLocaleString('en-IN') : 'N/A';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text.white text-white">
          {client.name}
        </h1>
        <div className="text-sm text-gray-400 mt-1">
          Risk: {client.riskLevel ?? '—'} · Income: ₹{incomeDisplay} · AUM: ₹
          {aumDisplay}
        </div>
        {error && (
          <div className="mt-2 text-xs text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-800 p-4 bg-[#020617]">
          <div className="text-xs text-gray-400 mb-1">
            Total Loan Exposure
          </div>
          <div className="text-xl text-white">
            ₹{(totalLoanExposure ?? 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 p-4 bg-[#020617]">
          <div className="text-xs text-gray-400 mb-1">Active Loans</div>
          <div className="text-xl text-white">
            {activeLoansCount ?? 0}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 p-4 bg-[#020617]">
          <div className="text-xs text-gray-400 mb-1">Active Goals</div>
          <div className="text-xl text-white">
            {activeGoalsCount ?? 0}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 p-4 bg-[#020617]">
          <div className="text-xs text-gray-400 mb-1">
            Avg Goal Progress
          </div>
          <div className="text-xl text-white">
            {(avgGoalProgress ?? 0).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Health + risk alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClientHealth client={client} loans={loans} goals={goals} />
        <RiskAlerts client={client} loans={loans} />
      </div>

      {/* Loans (now interactive with backend) */}
      <LoansTable
        loans={loans}
        onChangeStatus={changeLoanStatus}
        currentRole={CURRENT_ROLE}
        actionLoading={actionLoading}
      />

      {/* Goals & SIP */}
      <GoalsTable goals={goals} />

      {/* AI suggestions */}
      <LoanOptimizationPanel suggestions={optimizations} />

      {/* Audit logs */}
      <AuditLogTable logs={auditLogs} />
    </div>
  );
}
