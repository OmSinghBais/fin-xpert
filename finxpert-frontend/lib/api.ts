// lib/api.ts
import {
    Client,
    ClientDashboardData,
    LoanStatus,
    LoanOptimizationSuggestion,
    AuditLogEntry,
  } from './types';
  
  // ✅ Nest backend base URL (NO /api prefix)
  const API_BASE = 'http://localhost:3001';
  
  // ✅ Helper to build headers with auth token (if present)
  function getAuthHeaders(extra?: HeadersInit): HeadersInit {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
    return {
      'Content-Type': 'application/json',
      ...(extra || {}),
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  }
  
  // ✅ Generic API helper
  async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      ...(init || {}),
      headers: getAuthHeaders(init?.headers),
    });
  
    if (!res.ok) {
      // try to read JSON, fall back to text
      let message = `API error ${res.status}`;
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch {
        const text = await res.text().catch(() => '');
        if (text) message = `API error ${res.status}: ${text}`;
      }
      throw new Error(message);
    }
  
    return res.json();
  }
  
  /* ------------------------------------------------------------------ */
  /*  AUTH                                                               */
  /* ------------------------------------------------------------------ */
  
  export async function login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, // no auth header needed for login
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || 'Login failed');
    }
  
    return res.json(); // { accessToken, advisor }
  }
  
  export async function registerAdvisor(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, // no auth header needed for register
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || 'Register failed');
    }
  
    return res.json(); // { advisor, accessToken }
  }
  
  /* ------------------------------------------------------------------ */
  /*  CLIENTS + DASHBOARD                                               */
  /* ------------------------------------------------------------------ */
  
  // generic GET
  export function apiGet<T>(path: string): Promise<T> {
    return api<T>(path);
  }
  
  // GET /clients
  export function getClients(): Promise<Client[]> {
    return api<Client[]>('/clients');
  }
  
  // You can adapt this to whatever your backend returns
  // Right now assumes GET /clients/:id is your dashboard source
  export function getClientDashboard(
    clientId: string,
  ): Promise<ClientDashboardData> {
    return api<ClientDashboardData>(`/clients/${clientId}`);
  }
  
  /* ------------------------------------------------------------------ */
  /*  LOANS + AI + AUDIT LOGS                                           */
  /* ------------------------------------------------------------------ */
  
  // PATCH /loans/:id/status
  export function updateLoanStatus(
    loanId: string,
    status: LoanStatus,
    note?: string,
  ) {
    return api(`/loans/${loanId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  }
  
 /* -------------------------------------------------- */
/*  PORTFOLIO (REAL BACKEND ROUTES)                   */
/* -------------------------------------------------- */

// GET /clients/{clientId}/portfolio
export function getClientPortfolio(clientId: string) {
    return api(`/clients/${clientId}/portfolio`);
  }
export function getAuditLogs(clientId: string): Promise<AuditLogEntry[]> {
    return api<AuditLogEntry[]>(`/clients/${clientId}/audit-logs`);
  }
  
  // GET /clients/{clientId}/portfolio/risk-score
  export function getRiskScore(clientId: string) {
    return api(`/clients/${clientId}/portfolio/risk-score`);
  }
  
  // GET /clients/{clientId}/portfolio/tax-optimization
  export function getTaxOptimization(clientId: string) {
    return api(`/clients/${clientId}/portfolio/tax-optimization`);
  }
  
  // GET /clients/{clientId}/portfolio/insights
  export function getPortfolioInsights(clientId: string) {
    return api(`/clients/${clientId}/portfolio/insights`);
  }
  
  // GET /clients/{clientId}/portfolio-snapshot
  export function getPortfolioSnapshot(clientId: string) {
    return api(`/clients/${clientId}/portfolio-snapshot`);
  }
  
  // GET /credit/score/{clientId}
  export function getCreditScore(clientId: string) {
    return api(`/credit/score/${clientId}`);
  }
  