// Public exports for notifications feature

export { default as NotificationBell } from './NotificationBell';
export { default as NotificationPanel } from './NotificationPanel';
export { NotificationProvider, useNotifications } from './NotificationContext';

export * from './types';
export {
  getNotifications,
  getNotification,
  getUnreadCount,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
} from './api/notificationsApi';
