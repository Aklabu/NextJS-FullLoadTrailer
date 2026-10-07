// Server Component shell — reads JWT cookie and fetches the current user on every request.
// Passes user + notification count to NavbarClient for rendering.

import { cookies } from 'next/headers';
import NavbarClient from './NavbarClient';
import type { AuthUser } from '@/lib/types/auth';
import { getAccessToken } from '@/lib/api/tokens';
import { API_BASE } from '@/lib/api/client';

// Fetch the authenticated user's profile from the backend using the access token cookie.
// Returns null on any failure — navbar will render in logged-out state.
async function getSessionUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE}/api/accounts/me/`, {
      headers: { Authorization: `Bearer ${token}` },
      // Revalidate on every request — user data can change (verification status, etc.)
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const json = await res.json();
    const d = json.data;

    // Map API response fields to the AuthUser shape used throughout the app
    return {
      id: d.id,
      email: d.email,
      role: d.role,
      verificationStatus: d.verification_status,
      tier: d.tier,
      companyName: d.name,
      hasSeenOnboarding: d.has_seen_onboarding,
    } satisfies AuthUser;
  } catch {
    return null;
  }
}

// Fetch unread notification count — silently returns 0 on any error
async function getNotificationCount(token: string): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/unread-count/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return 0;
    const json = await res.json();
    return json?.count ?? 0;
  } catch {
    return 0;
  }
}

export default async function Navbar() {
  // cookies() is async in Next.js 15+ — must be awaited before calling .toString()
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const token = getAccessToken(cookieHeader);

  const user = token ? await getSessionUser(token) : null;
  const notificationCount = user && token ? await getNotificationCount(token) : 0;

  return <NavbarClient user={user} notificationCount={notificationCount} />;
}
