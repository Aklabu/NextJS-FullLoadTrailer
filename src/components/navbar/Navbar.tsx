// Server Component shell — resolves session user and passes it to NavbarClient
// Replace getSessionUser() with real auth helper once Django JWT is wired up

import NavbarClient from './NavbarClient';
import type { AuthUser } from '@/lib/types/auth';

// TODO: read JWT from cookie, verify, fetch user from /api/accounts/me/
async function getSessionUser(): Promise<AuthUser | null> {
  return null;
}

// TODO: GET /api/notifications/unread-count/
async function getNotificationCount(_userId: string): Promise<number> {
  return 0;
}

export default async function Navbar() {
  const user = await getSessionUser();
  const notificationCount = user ? await getNotificationCount(user.id) : 0;

  return <NavbarClient user={user} notificationCount={notificationCount} />;
}
