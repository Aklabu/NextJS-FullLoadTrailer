// Public shipment tracking API — GET /services/tracking/search/
// No authentication required.

import { API_BASE } from '@/lib/api/client';

export interface TrackingData {
  job_id: string;
  // Normalized to internal enum values: 'in_transit' | 'complete' | 'not_picked'
  status: string;
  from_location: string;
  to_location: string;
  driver_name: string;
  scheduled_date: string;
}

// Normalize the raw API status string to the internal values used by the UI
function normalizeStatus(raw: string): string {
  const s = raw.toLowerCase().replace(/\s+/g, '_');
  if (s === 'in_transit') return 'in_transit';
  if (s === 'complete' || s === 'completed' || s === 'delivered') return 'complete';
  if (s === 'not_picked' || s === 'not_picked_up' || s === 'booked') return 'not_picked';
  return s;
}

export interface TrackingResponse {
  status: 'success';
  message: string;
  data: TrackingData;
}

export interface TrackingErrorResponse {
  status: 'error';
  message: string;
  data: null;
}

// Possible error categories for UI differentiation
export type TrackingErrorKind =
  | 'not_found'    // 400 — no shipment found for this job ID
  | 'invalid'      // 400 — missing or malformed job_id
  | 'unavailable'  // 503 / 504 — upstream tracking service down
  | 'unknown';     // 500 or network failure

export class TrackingApiError extends Error {
  kind: TrackingErrorKind;
  constructor(message: string, kind: TrackingErrorKind) {
    super(message);
    this.name = 'TrackingApiError';
    this.kind = kind;
  }
}

export async function searchTracking(jobId: string): Promise<TrackingData> {
  const trimmed = jobId.trim();

  // Client-side guard — mirrors API validation
  if (!trimmed) throw new TrackingApiError('Job ID is required.', 'invalid');
  if (trimmed.length > 15) throw new TrackingApiError('Job ID must not exceed 15 characters.', 'invalid');

  const url = `${API_BASE}/services/tracking/search/?job_id=${encodeURIComponent(trimmed)}`;
  let res: Response;

  try {
    res = await fetch(url);
  } catch {
    throw new TrackingApiError('Unable to connect. Check your internet and try again.', 'unknown');
  }

  const data: TrackingResponse | TrackingErrorResponse = await res.json().catch(() => ({
    status: 'error' as const,
    message: 'Unexpected response from server.',
    data: null,
  }));

  if (res.ok && data.status === 'success') {
    const raw = (data as TrackingResponse).data;
    return {
      ...raw,
      status: normalizeStatus(raw.status),
    };
  }

  // Map HTTP status to a meaningful error kind
  const message = data.message || 'An error occurred. Please try again.';
  if (res.status === 503) throw new TrackingApiError(message, 'unavailable');
  if (res.status === 504) throw new TrackingApiError(message, 'unavailable');
  if (res.status === 500) throw new TrackingApiError(message, 'unknown');

  // 400 — distinguish "not found" from other validation errors
  if (message.toLowerCase().includes('no task found')) {
    throw new TrackingApiError(message, 'not_found');
  }
  throw new TrackingApiError(message, 'invalid');
}
