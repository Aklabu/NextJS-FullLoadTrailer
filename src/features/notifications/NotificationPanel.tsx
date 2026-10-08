'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getNotifications, markNotificationRead, markAllRead, deleteNotification } from './api/notificationsApi';
import { useNotifications } from './NotificationContext';
import type { Notification, NotificationCategory } from './types';
import { ApiError } from '@/lib/api/client';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case 'bid_placed':
      return '💰';
    case 'bid_countered':
      return '🔄';
    case 'counter_accepted':
      return '✅';
    case 'review_received':
      return '⭐';
    case 'new_message':
      return '💬';
    default:
      return '🔔';
  }
}

function getNotificationLink(notification: Notification): string {
  const { target, meta, type } = notification;
  
  switch (target.kind) {
    case 'load':
      return `/marketplace/loads/${target.id}`;
    case 'conversation':
      return `/messages/${target.id}`;
    case 'review':
      return `/profiles/${notification.actor?.id ?? ''}`;
    case 'bid':
      // For bid notifications, meta might contain load_id
      if (meta && 'load_id' in meta && meta.load_id) {
        return `/marketplace/loads/${meta.load_id}`;
      }
      return `/marketplace/loads/${target.id}`;
    default:
      return '#';
  }
}

// ─── Components ──────────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const [showActions, setShowActions] = useState(false);
  const link = getNotificationLink(notification);

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
  };

  return (
    <div
      className={`group relative border-b border-[#f0ece6] px-3 sm:px-4 py-3 transition-colors hover:bg-[#fafaf8] ${!notification.is_read ? 'bg-[#fff7ed]' : 'bg-white'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Link href={link} onClick={handleClick} className="block">
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Icon */}
          <span className="text-xl sm:text-2xl shrink-0 mt-0.5" aria-hidden="true">
            {getNotificationIcon(notification.type)}
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className={`text-xs sm:text-sm ${!notification.is_read ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'}`}>
                {notification.title}
              </p>
              {!notification.is_read && (
                <span className="h-2 w-2 rounded-full bg-[#fc3f07] shrink-0 mt-1.5" aria-label="Unread" />
              )}
            </div>
            <p className="mt-0.5 text-[11px] sm:text-xs text-neutral-500 line-clamp-2">{notification.body}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] text-neutral-400">{formatRelativeTime(notification.created_at)}</span>
              {notification.actor && (
                <>
                  <span className="text-[9px] sm:text-[10px] text-neutral-300">·</span>
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 truncate">{notification.actor.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Actions (show on hover for desktop, always show on mobile) */}
      {(showActions || window.innerWidth < 640) && (
        <div className="absolute right-2 top-2 flex items-center gap-1">
          {!notification.is_read && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
              className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-white hover:text-[#fc3f07]"
              title="Mark as read"
              aria-label="Mark as read"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-white hover:text-red-500"
            title="Delete"
            aria-label="Delete notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ category }: { category: NotificationCategory | 'all' }) {
  const messages = {
    all: 'No notifications yet',
    bids: 'No bid notifications',
    messages: 'No message notifications',
    reviews: 'No review notifications',
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-3 text-4xl" aria-hidden="true">🔔</span>
      <p className="text-sm font-medium text-neutral-600">{messages[category]}</p>
      <p className="mt-1 text-xs text-neutral-400">You're all caught up!</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="divide-y divide-[#f0ece6]">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-neutral-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-neutral-100" />
              <div className="h-3 w-full rounded bg-neutral-100" />
              <div className="h-2 w-20 rounded bg-neutral-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Panel ──────────────────────────────────────────────────────────────

export default function NotificationPanel() {
  const { unreadCounts, setUnreadCounts } = useNotifications();
  const [activeTab, setActiveTab] = useState<NotificationCategory | 'all'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadNotifications = useCallback(async (category: NotificationCategory | 'all', pageNum: number) => {
    setLoading(true);
    try {
      const response = await getNotifications({
        category: category === 'all' ? undefined : category,
        page: pageNum,
      });
      
      if (pageNum === 1) {
        setNotifications(response.results);
      } else {
        setNotifications((prev) => [...prev, ...response.results]);
      }
      setHasMore(response.next !== null);
    } catch (err) {
      // API not available yet or auth error - show empty state
      console.debug('Failed to load notifications:', err instanceof ApiError ? err.message : err);
      setNotifications([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    loadNotifications(activeTab, 1);
  }, [activeTab, loadNotifications]);

  const handleMarkRead = async (id: string) => {
    try {
      const result = await markNotificationRead(id);
      // Update notification state
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      // Update unread counts from server response
      setUnreadCounts(result.unread_counts);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const result = await markAllRead(activeTab === 'all' ? undefined : activeTab);
      // Update local notification state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      // Update unread counts from server response
      setUnreadCounts(result.unread_counts);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    // Find the notification to check if it was unread
    const notification = notifications.find((n) => n.id === id);
    const wasUnread = notification && !notification.is_read;
    
    try {
      await deleteNotification(id);
      // Remove from local state
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      
      // Update unread counts if the deleted notification was unread
      if (wasUnread && notification) {
        setUnreadCounts((prev) => {
          const category = notification.category;
          return {
            ...prev,
            total: Math.max(0, prev.total - 1),
            bids: category === 'bids' ? Math.max(0, prev.bids - 1) : prev.bids,
            messages: category === 'messages' ? Math.max(0, prev.messages - 1) : prev.messages,
            reviews: category === 'reviews' ? Math.max(0, prev.reviews - 1) : prev.reviews,
          };
        });
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
      // Could show a toast/error message to user here
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotifications(activeTab, nextPage);
  };

  const unreadCount = unreadCounts.total;
  const tabs: Array<{ key: NotificationCategory | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'bids', label: 'Bids' },
    { key: 'messages', label: 'Messages' },
    { key: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="flex h-full max-h-[600px] w-screen sm:w-[420px] flex-col rounded-2xl border border-[#e8e0d6] bg-white shadow-xl">
      {/* Header */}
      <div className="shrink-0 border-b border-[#e8e0d6] px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-neutral-900">Notifications</h2>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[11px] sm:text-xs font-semibold text-[#fc3f07] transition-colors hover:text-[#d93506]"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-lg px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#fc3f07] text-white'
                  : 'text-neutral-600 hover:bg-[#fafaf8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && page === 1 ? (
          <LoadingSkeleton />
        ) : notifications.length === 0 ? (
          <EmptyState category={activeTab} />
        ) : (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="border-t border-[#f0ece6] px-3 sm:px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="text-[11px] sm:text-xs font-semibold text-[#fc3f07] transition-colors hover:text-[#d93506] disabled:opacity-50"
                >
                  {loading ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
