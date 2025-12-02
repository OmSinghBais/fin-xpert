// utils/clientMetrics.ts
import type { Client } from '@/types/domain';

export function computeHealthScore(client: Client): number {
  const totalEmi = client.loans
    .filter((l) => l.status === 'DISBURSED' || l.status === 'APPROVED')
    .reduce((sum, l) => sum + l.emi, 0);

  const emiRatio = totalEmi / client.incomeMonthly; // ex: 0.35

  let score = 100;

  // EMI load penalties
  if (emiRatio > 0.6) score -= 50;
  else if (emiRatio > 0.4) score -= 30;
  else if (emiRatio > 0.3) score -= 15;

  // many active loans penalty
  const activeLoansCount = client.loans.filter(
    (l) => l.status === 'DISBURSED' || l.status === 'APPROVED'
  ).length;

  if (activeLoansCount >= 3) score -= 15;
  else if (activeLoansCount === 2) score -= 5;

  // simple risk-level tweak
  if (client.riskLevel === 'HIGH') score -= 10;
  if (client.riskLevel === 'LOW') score += 5;

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return score;
}

export function getRiskAlerts(client: Client): string[] {
  const alerts: string[] = [];

  const totalEmi = client.loans
    .filter((l) => l.status === 'DISBURSED' || l.status === 'APPROVED')
    .reduce((sum, l) => sum + l.emi, 0);

  const emiRatio = totalEmi / client.incomeMonthly;

  if (emiRatio > 0.5) {
    alerts.push(
      'EMI obligations exceed 50% of monthly income · high repayment risk.'
    );
  } else if (emiRatio > 0.4) {
    alerts.push(
      'EMI obligations exceed 40% of monthly income.'
    );
  }

  const activeLoansCount = client.loans.filter(
    (l) => l.status === 'DISBURSED' || l.status === 'APPROVED'
  ).length;

  if (activeLoansCount >= 3) {
    alerts.push('Client has 3 or more active loans.');
  }

  // SIP vs EMI conflict (very rough)
  const totalSip = client.goals
    .filter((g) => g.status === 'ACTIVE')
    .reduce((sum, g) => sum + g.requiredSip, 0);

  if (totalSip + totalEmi > client.incomeMonthly * 0.7) {
    alerts.push(
      'Combined SIP + EMI exceeds 70% of income · liquidity risk.'
    );
  }

  return alerts;
}
