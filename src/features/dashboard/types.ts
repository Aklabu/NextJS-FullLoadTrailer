import type { UserRole } from '@/lib/types/auth';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: string;
  variant: 'primary' | 'secondary';
}

export interface RoleConfig {
  role: UserRole;
  greeting: string;
  quickActions: QuickAction[];
}
