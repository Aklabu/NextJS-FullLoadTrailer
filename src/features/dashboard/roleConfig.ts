import type { RoleConfig } from './types';
import type { UserRole } from '@/lib/types/auth';

export const roleConfigs: Record<UserRole, RoleConfig> = {
  shipper: {
    role: 'shipper',
    greeting: 'Manage your shipments',
    quickActions: [
      {
        label: 'Post a Load',
        description: 'Create a new load listing',
        href: '/marketplace/post-load',
        icon: '📦',
        variant: 'primary',
      },
      {
        label: 'My Loads',
        description: 'View and manage your loads',
        href: '/marketplace/my-loads',
        icon: '📋',
        variant: 'secondary',
      },
      {
        label: 'Browse Board',
        description: 'Check available carriers',
        href: '/board',
        icon: '🚚',
        variant: 'secondary',
      },
      {
        label: 'Messages',
        description: 'View conversations',
        href: '/messages',
        icon: '💬',
        variant: 'secondary',
      },
    ],
  },
  broker: {
    role: 'broker',
    greeting: 'Manage your freight operations',
    quickActions: [
      {
        label: 'Post a Load',
        description: 'Create a new load listing',
        href: '/marketplace/post-load',
        icon: '📦',
        variant: 'primary',
      },
      {
        label: 'Pipeline Dashboard',
        description: 'View your job pipeline',
        href: '/marketplace/broker-dashboard',
        icon: '📊',
        variant: 'secondary',
      },
      {
        label: 'My Loads',
        description: 'View all your loads',
        href: '/marketplace/my-loads',
        icon: '📋',
        variant: 'secondary',
      },
      {
        label: 'Messages',
        description: 'View conversations',
        href: '/messages',
        icon: '💬',
        variant: 'secondary',
      },
    ],
  },
  carrier: {
    role: 'carrier',
    greeting: 'Find your next load',
    quickActions: [
      {
        label: 'Browse Loads',
        description: 'Find loads to bid on',
        href: '/marketplace/carrier/loads',
        icon: '🔍',
        variant: 'primary',
      },
      {
        label: 'My Bids',
        description: 'Track your bidding activity',
        href: '/marketplace/carrier/my-bids',
        icon: '⚡',
        variant: 'secondary',
      },
      {
        label: 'Post Capacity',
        description: 'Advertise available space',
        href: '/marketplace/carrier/post-capacity',
        icon: '🚚',
        variant: 'secondary',
      },
      {
        label: 'Messages',
        description: 'View conversations',
        href: '/messages',
        icon: '💬',
        variant: 'secondary',
      },
    ],
  },
};

export function getRoleConfig(role: UserRole): RoleConfig {
  return roleConfigs[role];
}
