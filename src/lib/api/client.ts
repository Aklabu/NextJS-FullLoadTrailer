// Base API client — all requests to the Django backend go through here.
// Handles: base URL, auth header injection, 401 token refresh, standard error shape.

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokens';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

// Standard error thrown by apiFetch on non-ok responses
export class ApiError extends Error {
  status: number;
  errors: Record<string, string | string[]> | null;

  constructor(status: number, message: string, errors: Record<string, string | string[]> | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// Attempt a token refresh — returns true if successful, false otherwise
async function tryRefreshTokens(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await fetch(`${API_BASE}/api/accounts/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) { clearTokens(); return false; }
    const data = await res.json();
    if (data.access) {
      // Use new refresh token if server rotates, otherwise keep the existing one
      const newRefresh = data.refresh ?? refresh;
      setTokens(data.access, newRefresh);
      return true;
    }
    clearTokens();
    return false;
  } catch {
    return false;
  }
}

interface FetchOptions extends RequestInit {
  // When true, skip the Authorization header (used for public endpoints)
  skipAuth?: boolean;
  // When true, skip the automatic 401 retry with refreshed token
  skipRefresh?: boolean;
}

// Core fetch wrapper — use this for all API calls
export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, skipRefresh = false, ...fetchOptions } = options;

  // Build headers — start with any caller-provided headers
  const headers = new Headers(fetchOptions.headers);

  // Attach auth header unless caller opts out
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  // Default Content-Type to JSON unless the body is FormData
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });

  // 401 — try token refresh once, then retry
  if (res.status === 401 && !skipRefresh && !skipAuth) {
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      // Retry with the new token
      return apiFetch<T>(path, { ...options, skipRefresh: true });
    }
    // Refresh failed — clear tokens and throw so caller can redirect to login
    clearTokens();
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  // 204 No Content — return empty object
  if (res.status === 204) return {} as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Extract a human-readable message from the Django response envelope
    const message =
      data?.message ||
      data?.detail ||
      data?.errors?.detail ||
      'An unexpected error occurred.';
    throw new ApiError(res.status, message, data?.errors ?? null);
  }

  return data as T;
}
