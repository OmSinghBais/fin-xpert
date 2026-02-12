// components/layout/Topbar.tsx
"use client";

export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 py-3">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">
          Advisor Workspace
        </h1>
        <p className="text-xs text-slate-400">
          Manage clients, portfolios and AI insights
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-300">
          Run AI Insights
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right text-xs">
            <div className="font-medium text-slate-100">Om (Advisor)</div>
            <div className="text-slate-500">Fixpert</div>
          </div>
          <div className="h-8 w-8 rounded-full bg-emerald-500/30" />
        </div>
      </div>
    </header>
  );
}
