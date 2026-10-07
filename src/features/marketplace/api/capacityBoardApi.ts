// Capacity board endpoints — Verified Carrier only.

import { apiFetch } from '@/lib/api/client';

// ─── Shared ───────────────────────────────────────────────────────────────────

export type CapacityStatus = 'active' | 'expired' | 'deactivated';

export interface CapacityPosting {
  id: string;
  origin: string;
  destination: string;
  available_from: string;
  available_to: string;
  cubic_feet: number;
  equipment_type: string;
  notes: string;
  status: CapacityStatus;
  posted_at: string;
  offers_received: number;
}

// ─── POST /marketplace/capacity/ ─────────────────────────────────────────────
// Creates a new capacity posting.
// 400 if available_to is not after available_from.

export interface PostCapacityPayload {
  origin: string;
  destination: string;
  available_from: string;
  available_to: string;
  cubic_feet: number;
  equipment_type: string;
  notes?: string;
}

export interface PostCapacityResponse {
  status: 'success';
  message: string;
  data: CapacityPosting;
}

export async function postCapacity(payload: PostCapacityPayload): Promise<PostCapacityResponse> {
  return apiFetch<PostCapacityResponse>('/api/marketplace/capacity/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── GET /marketplace/carrier/my-capacity/ ───────────────────────────────────
// Returns the carrier's capacity postings split into active and past groups.

export interface GetMyCapacityResponse {
  status: 'success';
  message: string;
  data: {
    active: CapacityPosting[];
    past: CapacityPosting[];
  };
}

export async function getMyCapacity(): Promise<GetMyCapacityResponse> {
  return apiFetch<GetMyCapacityResponse>('/api/marketplace/carrier/my-capacity/');
}

// ─── PATCH /marketplace/capacity/{posting_id}/ ───────────────────────────────
// Partial update of an active capacity posting. Owner only.
// 400 if posting is not active, 404 if not found.

export type PatchCapacityPayload = Partial<PostCapacityPayload>;

export interface PatchCapacityResponse {
  status: 'success';
  message: string;
  data: CapacityPosting;
}

export async function patchCapacity(
  postingId: string,
  payload: PatchCapacityPayload,
): Promise<PatchCapacityResponse> {
  return apiFetch<PatchCapacityResponse>(`/api/marketplace/capacity/${postingId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// ─── POST /marketplace/capacity/{posting_id}/deactivate/ ─────────────────────
// Deactivates an active capacity posting. Owner only.
// 404 if posting not found.

export interface DeactivateCapacityResponse {
  status: 'success';
  message: string;
  data: null;
}

export async function deactivateCapacity(postingId: string): Promise<DeactivateCapacityResponse> {
  return apiFetch<DeactivateCapacityResponse>(
    `/api/marketplace/capacity/${postingId}/deactivate/`,
    { method: 'POST' },
  );
}

// ─── GET /marketplace/capacity/{posting_id}/offers/ ──────────────────────────
// Returns all offers received on a capacity posting. Owner only.
// 404 if posting not found.

export interface CapacityOfferParty {
  id: string;
  company_name: string;
  role: 'shipper' | 'broker';
  verification_status: string;
}

export interface CapacityOffer {
  id: string;
  offered_by: CapacityOfferParty;
  message: string;
  offered_at: string;
}

export interface GetCapacityOffersResponse {
  status: 'success';
  message: string;
  data: {
    posting: CapacityPosting;
    offers: CapacityOffer[];
  };
}

export async function getCapacityOffers(postingId: string): Promise<GetCapacityOffersResponse> {
  return apiFetch<GetCapacityOffersResponse>(`/api/marketplace/capacity/${postingId}/offers/`);
}
