// Cookie-based JWT storage — works in both browser (client) and server (Next.js Server Components)
// Access token: short-lived, read on every request
// Refresh token: long-lived, used only to obtain a new access token

const ACCESS_TOKEN_KEY = 'ftl_access';
const REFRESH_TOKEN_KEY = 'ftl_refresh';

// Cookie max-age in seconds
const ACCESS_MAX_AGE = 60 * 15;        // 15 minutes
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Build a secure cookie string for the browser
function cookieString(name: string, value: string, maxAge: number): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

// --- Client-side helpers (browser only) ---

export function setTokens(access: string, refresh: string): void {
  document.cookie = cookieString(ACCESS_TOKEN_KEY, access, ACCESS_MAX_AGE);
  document.cookie = cookieString(REFRESH_TOKEN_KEY, refresh, REFRESH_MAX_AGE);
}

export function clearTokens(): void {
  document.cookie = `${ACCESS_TOKEN_KEY}=; Path=/; Max-Age=0`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; Path=/; Max-Age=0`;
}

// Parse a single cookie value from a raw cookie header string
function parseCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

// --- Universal helpers (client + server) ---
// On server: pass the cookies() string from next/headers
// On client: pass document.cookie

export function getAccessToken(cookieHeader?: string): string | null {
  const src = cookieHeader ?? (typeof document !== 'undefined' ? document.cookie : '');
  return parseCookie(src, ACCESS_TOKEN_KEY);
}

export function getRefreshToken(cookieHeader?: string): string | null {
  const src = cookieHeader ?? (typeof document !== 'undefined' ? document.cookie : '');
  return parseCookie(src, REFRESH_TOKEN_KEY);
}
