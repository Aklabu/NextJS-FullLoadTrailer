// Notifications API client
// All endpoints require a valid JWT (handled by apiFetch).

import { apiFetch } from '@/lib/api/client';
import type {
  Notification,
  NotificationCategory,
  NotificationPreferences,
  UnreadCounts,
} from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NotificationsListResponse {
  status: 'success';
  message: string;
  data: {
    notifications: Notification[];
    has_more: boolean;
    total: number;
  };
}

interface UnreadCountResponse {
  status: 'success';
  message: string;
  data: UnreadCounts;
}

interface PreferencesResponse {
  status: 'success';
  message: string;
  data: NotificationPreferences;
}

// ─── GET /api/notifications/ ─────────────────────────────────────────────────

// Fetch paginated notifications list.
// Pass category to filter, page for pagination (10 per page, max 5 pages).
export async function getNotifications(params?: {
  category?: NotificationCategory;
  page?: number;
}): Promise<NotificationsListResponse['data']> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.page) qs.set('page', String(params.page));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  const res = await apiFetch<NotificationsListResponse>(`/api/notifications/${query}`);
  return res.data;
}

// ─── GET /api/notifications/unread-count/ ────────────────────────────────────

// Fetch unread notification counts by category + total.
// Lightweight endpoint for polling the navbar badge.
export async function getUnreadCount(): Promise<UnreadCounts> {
  const res = await apiFetch<UnreadCountResponse>('/api/notifications/unread-count/');
  return res.data;
}

// ─── PATCH /api/notifications/:id/read/ ──────────────────────────────────────

// Mark a single notification as read.
export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch(`/api/notifications/${id}/read/`, { method: 'PATCH' });
}

// ─── POST /api/notifications/read-all/ ───────────────────────────────────────

// Mark all notifications as read (optionally filtered by category).
export async function markAllRead(category?: NotificationCategory): Promise<void> {
  const body = category ? JSON.stringify({ category }) : undefined;
  await apiFetch('/api/notifications/read-all/', { method: 'POST', body });
}

// ─── DELETE /api/notifications/:id/ ──────────────────────────────────────────

// Delete a single notification.
export async function deleteNotification(id: string): Promise<void> {
  await apiFetch(`/api/notifications/${id}/`, { method: 'DELETE' });
}

// ─── GET /api/notifications/preferences/ ─────────────────────────────────────

// Fetch user's notification preferences.
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const res = await apiFetch<PreferencesResponse>('/api/notifications/preferences/');
  return res.data;
}

// ─── PATCH /api/notifications/preferences/ ───────────────────────────────────

// Update user's notification preferences.
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const res = await apiFetch<PreferencesResponse>('/api/notifications/preferences/', {
    method: 'PATCH',
    body: JSON.stringify(preferences),
  });
  return res.data;
}
