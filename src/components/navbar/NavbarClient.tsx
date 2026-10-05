'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import VerificationBadge from '@/components/VerificationBadge';
import {
  publicNavItems,
  authedNavItems,
  profileDropdownItems,
  getMarketplaceHref,
} from '@/lib/navConfig';
import type { AuthUser } from '@/lib/types/auth';

interface NavbarClientProps {
  user: AuthUser | null;
  notificationCount?: number;
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`relative px-1 py-0.5 text-sm font-medium transition-colors
        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full
        after:bg-[#ff3d03] after:transition-all
        ${isActive ? 'text-white after:w-full' : 'after:w-0 hover:after:w-full'}`}
      style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.85)' }}
    >
      {children}
    </Link>
  );
}

import Image from 'next/image';

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="FullTrailerLoad home">
      <Image
        src="/images/logo-icon.png"
        alt=""
        width={36}
        height={36}
        className="rounded-lg"
        aria-hidden="true"
      />
      <span className="text-[15px] font-extrabold tracking-tight" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <span style={{ color: '#ffffff' }}>FullTrailerLoad</span><span style={{ color: '#ff3d03' }}>.com</span>
      </span>
    </Link>
  );
}

function NotificationBell({ count = 0 }: { count: number }) {
  return (
    <button
      type="button"
      aria-label={count > 0 ? `${count} unread notifications` : 'Notifications'}
      className="relative p-1.5 rounded-md transition-colors hover:bg-white/10"
      style={{ color: 'rgba(255,255,255,0.9)' }}
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
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {count > 0 && (
        <span
          className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
          style={{ background: '#d13100' }}
          aria-hidden="true"
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function ProfileDropdown({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-white/10"
        style={{ color: 'rgba(255,255,255,0.95)' }}
      >
        <span
          className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
          style={{ background: '#ff3d03', color: '#1A1953' }}
          aria-hidden="true"
        >
          {user.companyName.slice(0, 2).toUpperCase()}
        </span>
        <span className="hidden sm:block max-w-[120px] truncate">{user.companyName}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1.5 w-52 rounded-xl border border-neutral-100 bg-white shadow-lg ring-1 ring-black/5 py-1 z-50"
        >
          <div className="px-3 py-2 border-b border-neutral-100">
            <p className="text-xs text-neutral-400 mb-1">Status</p>
            <VerificationBadge status={user.verificationStatus} />
          </div>

          {profileDropdownItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="border-t border-neutral-100 mt-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => { setOpen(false); onLogout(); }}
              className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  user,
  open,
  onClose,
  onLogout,
}: {
  user: AuthUser | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const navItems = user ? authedNavItems : publicNavItems;

  if (!open) return null;

  return (
    <div className="md:hidden px-4 pt-3 pb-4 space-y-1" style={{ background: '#1B211A', borderTop: '1px solid rgba(255,203,86,0.2)' }}>
      {navItems.map((item) => {
        const href = user && item.label === 'Marketplace' ? getMarketplaceHref(user.role) : item.href;
        return (
          <Link
            key={item.href}
            href={href}
            onClick={onClose}
            className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="pt-2 mt-2 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {user ? (
          <>
            {profileDropdownItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => { onClose(); onLogout(); }}
              className="block w-full text-left rounded-md px-3 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              onClick={onClose}
              className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={onClose}
              className="block rounded-md px-3 py-2 text-sm font-medium text-center rounded-lg transition-opacity hover:opacity-90"
                style={{ background: '#ff3d03', color: '#1A1953' }}
              >
                Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function NavbarClient({ user, notificationCount = 0 }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // TODO: call POST /api/accounts/logout/ and clear JWT
  function handleLogout() {
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: '#1B211A', borderBottom: '2px solid #ff3d03' }}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Logo />

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {user
            ? authedNavItems.map((item) => {
                const href = item.label === 'Marketplace' ? getMarketplaceHref(user.role) : item.href;
                return <NavLink key={item.href} href={href}>{item.label}</NavLink>;
              })
            : publicNavItems.map((item) => (
                <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
              ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NotificationBell count={notificationCount} />
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{ background: '#ff3d03', color: '#1A1953' }}
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-1.5 rounded-md transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <MobileMenu
        user={user}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
