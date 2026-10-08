'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StatCard } from './StatCard';
import { QuickActionCard } from './QuickActionCard';
import { ActivityFeed } from './ActivityFeed';
import { getRoleConfig } from './roleConfig';
import { getDashboardData, type DashboardStats, type RecentActivity } from './api/dashboardApi';
import { getMe } from '@/features/auth/api/authApi';
import { ApiError } from '@/lib/api/client';
import type { UserRole, UserTier } from '@/lib/types/auth';

interface DashboardUser {
  role: UserRole;
  tier: UserTier;
  companyName: string;
}

export function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Load user profile
        const userRes = await getMe();
        const userData = userRes.data;
        const dashboardUser: DashboardUser = {
          role: userData.role,
          tier: userData.tier,
          companyName: userData.name,
        };
        setUser(dashboardUser);

        // Load dashboard data based on role
        const dashData = await getDashboardData(userData.role);
        setStats(dashData.stats);
        setActivities(dashData.recent_activity);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.push('/auth/login');
        }
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="px-6 py-12">
        <div className="h-8 w-64 animate-pulse rounded bg-neutral-200" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-neutral-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roleConfig = getRoleConfig(user.role);
  const statCards = getStatCards(user.role, stats);

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Welcome back, {user.companyName}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">{roleConfig.greeting}</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roleConfig.quickActions.map((action, index) => (
            <QuickActionCard key={index} action={action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}

function getStatCards(role: UserRole, stats: DashboardStats) {
  if (role === 'carrier') {
    return [
      {
        label: 'Active Bids',
        value: stats.active_bids_count ?? 0,
        icon: '⚡',
      },
      {
        label: 'Won Bids',
        value: stats.won_bids ?? 0,
        icon: '🎯',
      },
      {
        label: 'Unread Notifications',
        value: stats.unread_notifications ?? 0,
        icon: '🔔',
      },
      {
        label: 'Messages',
        value: 0, // TODO: add when messaging API supports count
        icon: '💬',
      },
    ];
  }

  // Shipper/Broker stats
  return [
    {
      label: 'Total Loads',
      value: stats.total_loads ?? 0,
      icon: '📦',
    },
    {
      label: 'Active Bids',
      value: stats.active_bids ?? 0,
      icon: '⚡',
    },
    {
      label: 'Booked',
      value: stats.booked_loads ?? 0,
      icon: '✅',
    },
    {
      label: 'Completed',
      value: stats.completed_loads ?? 0,
      icon: '🏁',
    },
  ];
}
