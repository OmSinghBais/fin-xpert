// components/RiskAlerts.tsx
'use client';

import { Client, Loan } from '@/lib/types';

interface Props {
  client: Client;
  loans: Loan[];
}

export function RiskAlerts({ client, loans }: Props) {
  const alerts: string[] = [];

  const activeLoans = loans.filter(
    (l) => l.status === 'APPROVED' || l.status === 'DISBURSED',
  );
  const totalEmi = activeLoans.reduce((s, l) => s + (l.emi ?? 0), 0);
  const income = client.incomeMonthly ?? 0;
  const emiRatio = income > 0 ? totalEmi / income : 0;

  if (emiRatio > 0.5) {
    alerts.push(
      `High EMI burden: EMIs are about ${(emiRatio * 100).toFixed(
        0,
      )}% of monthly income.`,
    );
  }

  if (activeLoans.length > 3) {
    alerts.push(`Multiple active loans (${activeLoans.length}).`);
  }

  const totalLoanAmount = activeLoans.reduce((s, l) => s + (l.amount ?? 0), 0);
  if (income > 0 && totalLoanAmount > income * 12) {
    alerts.push(
      `Total outstanding loans (~₹${totalLoanAmount.toLocaleString(
        'en-IN',
      )}) exceed 12x monthly income.`,
    );
  }

  if (!alerts.length) return null;

  return (
    <div className="rounded-xl border border-yellow-700 bg-yellow-900/20 p-4">
      <div className="text-sm font-semibold text-yellow-300 mb-2">
        Risk Alerts
      </div>
      <ul className="list-disc list-inside text-sm text-yellow-100 space-y-1">
        {alerts.map((a, idx) => (
          <li key={idx}>{a}</li>
        ))}
      </ul>
    </div>
  );
}
