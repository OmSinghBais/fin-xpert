// components/ClientHealth.tsx
'use client';

import { Client, Loan, Goal } from '@/lib/types';

interface Props {
  client: Client;
  loans: Loan[];
  goals: Goal[];
}

function computeHealthScore(client: Client, loans: Loan[], goals: Goal[]): number {
  const totalEmi = loans
    .filter((l) => l.status === 'DISBURSED' || l.status === 'APPROVED')
    .reduce((sum, l) => sum + (l.emi ?? 0), 0);

  const income = client.incomeMonthly ?? 0;
  const emiRatio = income > 0 ? totalEmi / income : 0;

  let score = 100;

  if (emiRatio > 0.6) score -= 40;
  else if (emiRatio > 0.4) score -= 25;
  else if (emiRatio > 0.3) score -= 10;

  const risk = (client.riskLevel ?? '').toUpperCase();
  if (risk === 'HIGH') score -= 15;
  else if (risk === 'MODERATE') score -= 5;

  const activeGoals = goals.filter((g) => g.status === 'ACTIVE').length;
  if (activeGoals >= 2) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function ClientHealth({ client, loans, goals }: Props) {
  const score = computeHealthScore(client, loans, goals);

  const label =
    score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Risky';

  const labelColor =
    score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-300' : 'text-red-400';

  return (
    <div className="rounded-xl border border-gray-800 p-4 bg-[#020617]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">Financial Health</div>
          <div className="text-2xl font-semibold text-white">{score}</div>
          <div className={`text-sm ${labelColor}`}>{label}</div>
        </div>
        <div className="w-32">
          <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-400"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
