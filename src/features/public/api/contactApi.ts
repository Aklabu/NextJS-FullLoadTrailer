// Contact / support form API — POST /services/support/contact/
// Public endpoint, no auth required, multipart/form-data.

import { API_BASE } from '@/lib/api/client';

export type Urgency = 'normal' | 'urgent';
export type Category =
  | 'account_verification'
  | 'rate_dispute'
  | 'billing_escrow'
  | 'technical_issue';

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  urgency: Urgency;
  category: Category;
  message: string;
  attachments?: File[];
}

export interface ContactResponse {
  status: 'success';
  message: string;
  data: null;
}

export interface ContactErrorResponse {
  status: 'error';
  message: string;
  errors: Record<string, string[]>;
}

// Submits the contact form. Throws a ContactErrorResponse on 400, re-throws
// unknown errors for the caller to handle as network failures.
export async function submitContactForm(payload: ContactPayload): Promise<ContactResponse> {
  const body = new FormData();
  body.append('name', payload.name);
  body.append('email', payload.email);
  if (payload.company) body.append('company', payload.company);
  body.append('urgency', payload.urgency);
  body.append('category', payload.category);
  body.append('message', payload.message);
  payload.attachments?.forEach((file) => body.append('attachments', file));

  const res = await fetch(`${API_BASE}/services/support/contact/`, {
    method: 'POST',
    // No Content-Type header — browser sets multipart boundary automatically
    body,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 201 && data.status === 'success') {
    return data as ContactResponse;
  }

  if (res.status === 400) {
    throw data as ContactErrorResponse;
  }

  // Unexpected error — surface the message if available
  throw {
    status: 'error',
    message: data?.message || 'Something went wrong. Please try again.',
    errors: {},
  } as ContactErrorResponse;
}
