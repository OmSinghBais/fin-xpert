// components/RoleGate.tsx
'use client';

import { ReactNode } from 'react';
import { UserRole } from '@/lib/types';

interface Props {
  allowed: UserRole[];
  currentRole: UserRole;
  children: ReactNode;
}

export function RoleGate({ allowed, currentRole, children }: Props) {
  if (!allowed.includes(currentRole)) return null;
  return <>{children}</>;
}
