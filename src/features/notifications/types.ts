// Notification types and interfaces

export type NotificationType =
  | 'bid_placed'
  | 'bid_countered'
  | 'counter_accepted'
  | 'review_received'
  | 'new_message';

export type NotificationCategory = 'bids' | 'messages' | 'reviews';

export type NotificationPriority = 'normal' | 'high';

export interface NotificationActor {
  id: string;
  name: string;
}

export interface NotificationTarget {
  kind: 'load' | 'conversation' | 'review' | 'bid';
  id: string;
}

export interface NotificationMeta {
  amount?: string;
  job_id?: string;
  rating?: number;
  [key: string]: string | number | undefined;
}

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  priority: NotificationPriority;
  is_read: boolean;
  created_at: string;
  target: NotificationTarget;
  meta?: NotificationMeta;
  actor?: NotificationActor;
}

export interface NotificationPreferences {
  bid_placed: boolean;
  bid_countered: boolean;
  counter_accepted: boolean;
  review_received: boolean;
  new_message: boolean;
}

export interface UnreadCounts {
  total: number;
  bids: number;
  messages: number;
  reviews: number;
}
