// Notifications API client
// All endpoints require a valid JWT (handled by apiFetch).

import { apiFetch } from '@/lib/api/client';
import type {
  Notification,
  NotificationCategory,
  NotificationType,
  NotificationPreferences,
  UnreadCounts,
} from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

// Django REST Framework pagination response
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface NotificationsListResponse extends PaginatedResponse<Notification> {}

// Standard API response wrapper (used by some endpoints)
interface ApiResponseWrapper<T> {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: T;
  errors: null;
}

interface NotificationDetailResponse extends ApiResponseWrapper<Notification> {}

interface MarkReadResponseData {
  notification: Notification;
  unread_counts: UnreadCounts;
}

interface MarkReadResponse extends ApiResponseWrapper<MarkReadResponseData> {}

interface MarkAllReadResponseData {
  marked_count: number;
  unread_counts: UnreadCounts;
}

interface MarkAllReadResponse extends ApiResponseWrapper<MarkAllReadResponseData> {}

interface DeleteNotificationResponse extends ApiResponseWrapper<null> {}

interface UnreadCountResponse extends ApiResponseWrapper<UnreadCounts> {}

interface PreferencesResponse {
  status: 'success';
  message: string;
  data: NotificationPreferences;
}

// ─── GET /api/notifications/ ─────────────────────────────────────────────────

// Fetch paginated notifications list (Django REST Framework pagination).
// Returns: { count, next, previous, results }
export async function getNotifications(params?: {
  category?: NotificationCategory;
  type?: NotificationType;
  is_read?: boolean;
  page?: number;
}): Promise<NotificationsListResponse> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.type) qs.set('type', params.type);
  if (params?.is_read !== undefined) qs.set('is_read', String(params.is_read));
  if (params?.page) qs.set('page', String(params.page));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  
  const res = await apiFetch<NotificationsListResponse>(`/api/notifications/${query}`);
  return res;
}

// ─── GET /api/notifications/:id/ ─────────────────────────────────────────────

// Fetch a single notification by ID.
// Throws ApiError on 404 (not found) or 401 (unauthorized).
export async function getNotification(id: string): Promise<Notification> {
  const res = await apiFetch<NotificationDetailResponse>(`/api/notifications/${id}/`);
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
// Returns updated notification AND new unread counts for immediate UI update.
export async function markNotificationRead(id: string): Promise<MarkReadResponseData> {
  const res = await apiFetch<MarkReadResponse>(`/api/notifications/${id}/read/`, { method: 'PATCH' });
  return res.data;
}

// ─── POST /api/notifications/read-all/ ───────────────────────────────────────

// Mark all notifications as read (optionally filtered by category).
// Query param: ?category=messages|bids|reviews (optional)
// Returns: marked_count + updated unread_counts
export async function markAllRead(category?: NotificationCategory): Promise<MarkAllReadResponseData> {
  const qs = category ? `?category=${category}` : '';
  const res = await apiFetch<MarkAllReadResponse>(`/api/notifications/read-all/${qs}`, { method: 'POST' });
  return res.data;
}

// ─── DELETE /api/notifications/:id/ ──────────────────────────────────────────

// Delete a single notification.
// Returns 200 with success message (not 204).
export async function deleteNotification(id: string): Promise<void> {
  await apiFetch<DeleteNotificationResponse>(`/api/notifications/${id}/`, { method: 'DELETE' });
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
