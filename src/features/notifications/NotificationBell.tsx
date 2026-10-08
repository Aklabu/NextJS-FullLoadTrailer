'use client';

import { useState, useEffect, useRef } from 'react';
import NotificationPanel from './NotificationPanel';
import { getUnreadCount } from './api/notificationsApi';

// ─── Bell Icon with Badge ────────────────────────────────────────────────────

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Poll unread count every 30 seconds
  useEffect(() => {
    async function fetchCount() {
      try {
        const counts = await getUnreadCount();
        setUnreadCount(counts.total);
      } catch (err) {
        // Silently fail — API not yet available or auth error
        // Don't show error to user, just keep count at 0
        console.debug('Notifications API not available:', err);
      }
    }

    // Only fetch if user is authenticated (has token)
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('accessToken');
    if (!hasToken) return;

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-md p-1.5 transition-colors hover:bg-white/10"
        style={{ color: 'rgba(255,255,255,0.9)' }}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: '#d13100' }}
            aria-hidden="true"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Panel */}
          <div
            ref={panelRef}
            className="fixed inset-x-0 top-14 z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications panel"
          >
            <NotificationPanel />
          </div>
        </>
      )}
    </div>
  );
}
