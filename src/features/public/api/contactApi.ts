// Contact form API — POST /api/contact/
// Public endpoint, no auth required, application/json.

import { API_BASE } from '@/lib/api/client';

export interface ContactPayload {
  full_name: string;
  phone: string;
  email: string;
  message: string;
  company_name?: string;
  fleet_size?: string;
}

export interface ContactResponse {
  success: true;
  statusCode: 201;
  message: string;
  timestamp: string;
  data: null;
  errors: null;
}

export interface ContactErrorResponse {
  success: false;
  statusCode: 400 | 500;
  message: string;
  timestamp: string;
  data: null;
  errors: Record<string, string[]> | null;
}

export async function submitContactForm(payload: ContactPayload): Promise<ContactResponse> {
  const res = await fetch(`${API_BASE}/api/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 201 && data.success === true) {
    return data as ContactResponse;
  }

  // 400 validation error or 500 server error — both have the same envelope shape
  throw {
    success: false,
    statusCode: res.status,
    message: data?.message || 'Something went wrong. Please try again.',
    timestamp: data?.timestamp ?? null,
    data: null,
    errors: data?.errors ?? null,
  } as ContactErrorResponse;
}
