import Link from 'next/link';
import type { RecentActivity } from './api/dashboardApi';

interface ActivityFeedProps {
  activities: RecentActivity[];
}

const activityIcons: Record<RecentActivity['type'], string> = {
  bid: '⚡',
  booking: '✅',
  message: '💬',
  notification: '🔔',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <p className="text-sm text-neutral-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-6 py-4">
        <h2 className="font-semibold text-neutral-900">Recent Activity</h2>
      </div>
      <div className="divide-y divide-neutral-100">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: RecentActivity }) {
  const icon = activityIcons[activity.type] || '•';
  const content = (
    <div className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-neutral-50">
      <div className="text-xl" role="img" aria-label={activity.type}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900">{activity.title}</p>
        <p className="mt-1 text-sm text-neutral-600">{activity.description}</p>
        <p className="mt-2 text-xs text-neutral-400">
          {formatTimestamp(activity.timestamp)}
        </p>
      </div>
    </div>
  );

  if (activity.link) {
    return (
      <Link href={activity.link} className="block">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
