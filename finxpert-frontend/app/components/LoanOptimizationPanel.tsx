// components/LoanOptimizationPanel.tsx
'use client';

import { LoanOptimizationSuggestion } from '@/lib/types';

interface Props {
  suggestions: LoanOptimizationSuggestion[];
}

export function LoanOptimizationPanel({ suggestions }: Props) {
  if (!suggestions.length) return null;

  return (
    <div className="mt-6 rounded-xl border border-blue-800 bg-blue-900/20 p-4">
      <div className="text-sm font-semibold text-blue-300 mb-2">
        AI Loan Optimization
      </div>
      <div className="space-y-3 text-sm">
        {suggestions.map((s) => (
          <div key={s.id} className="border border-blue-800 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="font-medium text-white">{s.title}</div>
              <div className="text-xs text-blue-200">
                {s.impactLabel}
              </div>
            </div>
            <div className="text-blue-100 mt-1">{s.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
