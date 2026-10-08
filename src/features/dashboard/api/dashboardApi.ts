import { getMyLoads } from '@/features/marketplace/api/loadsApi';
import { getMyBids } from '@/features/marketplace/api/biddingApi';
import { getNotifications, getUnreadCount } from '@/features/notifications/api/notificationsApi';
import type { UserRole } from '@/lib/types/auth';

export interface DashboardStats {
  // Shipper/Broker stats
  total_loads?: number;
  active_bids?: number;
  booked_loads?: number;
  completed_loads?: number;
  
  // Carrier stats
  active_bids_count?: number;
  won_bids?: number;
  
  // Community stats
  unread_notifications?: number;
}

export interface RecentActivity {
  id: string;
  type: 'bid' | 'booking' | 'message' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_activity: RecentActivity[];
}

// Aggregates data from existing APIs based on user role
export async function getDashboardData(role: UserRole): Promise<DashboardData> {
  const [stats, activities] = await Promise.all([
    fetchStats(role),
    fetchRecentActivity(role),
  ]);

  return { stats, recent_activity: activities };
}

async function fetchStats(role: UserRole): Promise<DashboardStats> {
  try {
    if (role === 'carrier') {
      // Fetch carrier-specific stats
      const [bidsRes, unreadCounts] = await Promise.all([
        getMyBids().catch(() => null),
        getUnreadCount().catch(() => null),
      ]);

      const stats: DashboardStats = {
        active_bids_count: bidsRes?.data.counts.active ?? 0,
        won_bids: bidsRes?.data.counts.won ?? 0,
        unread_notifications: unreadCounts?.total ?? 0,
      };

      return stats;
    } else {
      // Shipper/Broker stats
      const [loadsRes, unreadCounts] = await Promise.all([
        getMyLoads().catch(() => null),
        getUnreadCount().catch(() => null),
      ]);

      const stats: DashboardStats = {
        total_loads: loadsRes?.data.stats.total ?? 0,
        active_bids: loadsRes?.data.stats.active_bids ?? 0,
        booked_loads: loadsRes?.data.stats.booked ?? 0,
        completed_loads: loadsRes?.data.stats.completed ?? 0,
        unread_notifications: unreadCounts?.total ?? 0,
      };

      return stats;
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {};
  }
}

async function fetchRecentActivity(role: UserRole): Promise<RecentActivity[]> {
  try {
    // Fetch notifications as recent activity (limit to first 5)
    const notificationsRes = await getNotifications({ page: 1 });
    
    return notificationsRes.results.slice(0, 5).map(notif => ({
      id: notif.id,
      type: mapNotificationType(notif.type),
      title: notif.title,
      description: notif.body,
      timestamp: notif.created_at,
      link: buildNotificationLink(notif),
    }));
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

function mapNotificationType(type: string): RecentActivity['type'] {
  switch (type) {
    case 'bid_placed':
    case 'bid_countered':
    case 'counter_accepted':
      return 'bid';
    case 'new_message':
      return 'message';
    default:
      return 'notification';
  }
}

function buildNotificationLink(notif: any): string | undefined {
  const target = notif.target;
  if (!target) return undefined;

  switch (target.kind) {
    case 'load':
      return `/marketplace/loads/${target.id}`;
    case 'conversation':
      return `/messages/${target.id}`;
    case 'bid':
      return `/marketplace/carrier/my-bids`;
    case 'review':
      return `/profiles/${notif.actor?.id}/reviews`;
    default:
      return undefined;
  }
}
