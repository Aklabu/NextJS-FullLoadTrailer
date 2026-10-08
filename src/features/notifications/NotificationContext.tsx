'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUnreadCount } from './api/notificationsApi';
import type { UnreadCounts } from './types';

interface NotificationContextValue {
  unreadCounts: UnreadCounts;
  setUnreadCounts: React.Dispatch<React.SetStateAction<UnreadCounts>>;
  refreshUnreadCounts: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({
    total: 0,
    bids: 0,
    messages: 0,
    reviews: 0,
  });

  const refreshUnreadCounts = async () => {
    try {
      const counts = await getUnreadCount();
      setUnreadCounts(counts);
    } catch (err) {
      // Silently fail - user might not be logged in
      console.debug('Failed to fetch unread counts:', err);
    }
  };

  // Adaptive polling: poll more frequently when tab is active, less when inactive
  useEffect(() => {
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('accessToken');
    
    if (!hasToken) return;

    // Fetch immediately on mount
    refreshUnreadCounts();
    
    let interval: NodeJS.Timeout;
    let isTabVisible = !document.hidden;

    // Start polling based on tab visibility
    const startPolling = () => {
      clearInterval(interval);
      // Active tab: 1 minute, Inactive tab: 5 minutes
      const pollInterval = isTabVisible ? 60000 : 300000;
      interval = setInterval(refreshUnreadCounts, pollInterval);
    };

    startPolling();

    // Adjust polling when tab visibility changes
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        // Tab became active - refresh immediately and restart polling
        refreshUnreadCounts();
      }
      startPolling();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCounts, setUnreadCounts, refreshUnreadCounts }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
