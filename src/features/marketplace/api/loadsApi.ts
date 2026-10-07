// Marketplace loads API — Shipper, Broker, and Carrier endpoints
// All endpoints require a valid JWT (handled by apiFetch).

import { apiFetch } from '@/lib/api/client';
import type { PricingMode } from '@/features/marketplace/types';

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
}

export interface BidItem {
  id: string;
  carrier_id: string;
  carrier_name: string;
  amount: number;
  counter_amount: number | null;
  note: string;
  status: string;
  created_at: string;
}

export interface LoadData {
  id: string;
  job_id: string;
  status: string;
  pricing_mode: PricingMode;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  cubic_feet: number;
  weight: number | null;
  equipment_type: string;
  fixed_price: number | null;
  special_requirements: string | null;
  visibility: string;
  posted_at: string;
  bid_count: number;
  bids: BidItem[];
  audit_log: AuditLogEntry[];
}

// ─── POST /api/marketplace/loads/ ────────────────────────────────────────────

export interface PostLoadPayload {
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  cubic_feet: number;
  weight?: number | null;
  equipment_type: string;
  pricing_mode: PricingMode;
  fixed_price?: number | null;
  special_requirements?: string | null;
}

export interface PostLoadResponse {
  status: 'success';
  message: string;
  data: LoadData;
}

// Create a new biddable load listing.
// Throws ApiError on 400 (field errors) and 403 (wrong role / not verified).
export async function postLoad(payload: PostLoadPayload): Promise<PostLoadResponse> {
  return apiFetch<PostLoadResponse>('/api/marketplace/loads/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── GET /api/marketplace/my-loads/ ──────────────────────────────────────────

export type LoadStatusFilter = 'all' | 'open' | 'bidding' | 'booked' | 'completed' | 'expired';

export interface LoadStats {
  total: number;
  active_bids: number;
  booked: number;
  completed: number;
}

// Loads in the list response — bids array contains only active (pending/countered) bid IDs
export interface LoadListItem {
  id: string;
  job_id: string;
  status: string;
  origin: string;
  destination: string;
  cubic_feet: number;
  equipment_type: string;
  pickup_date: string;
  pricing_mode: PricingMode;
  fixed_price: number | null;
  bid_count: number;
  bids: { id: string }[]; // active bid IDs only — used to gate the Edit button
  posted_at: string;
}

export interface MyLoadsResponse {
  status: 'success';
  message: string;
  data: {
    stats: LoadStats;
    loads: LoadListItem[];
  };
}

// Fetch the authenticated shipper/broker's posted loads.
// Pass status to filter, q to search by job ID / route.
export async function getMyLoads(params?: {
  status?: LoadStatusFilter;
  q?: string;
}): Promise<MyLoadsResponse> {
  const qs = new URLSearchParams();
  if (params?.status && params.status !== 'all') qs.set('status', params.status);
  if (params?.q) qs.set('q', params.q);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch<MyLoadsResponse>(`/api/marketplace/my-loads/${query}`);
}

// ─── GET /api/marketplace/loads/:id/ ─────────────────────────────────────────

// Bid carrier shape — used in both views
export interface BidCarrier {
  id: string;
  company_name: string;
  verification_status: string;
  avg_rating: number | null;
}

// Full bid — owner view only
export interface BidDetail {
  id: string;
  carrier: BidCarrier;
  amount: string; // decimal string e.g. "1500.00"
  counter_amount: string | null;
  status: string;
  note: string;
  placed_at: string;
}

// Owner (shipper/broker) view — includes bids + audit_log
export interface LoadOwnerDetail {
  id: string;
  job_id: string;
  status: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  cubic_feet: number;
  weight: number | null;
  equipment_type: string;
  pricing_mode: PricingMode;
  fixed_price: number | null;
  special_requirements: string | null;
  visibility: string;
  posted_at: string;
  bid_count: number;
  bids: BidDetail[];
  audit_log: AuditLogEntry[];
  booking_id: string | null; // present when status === 'booked'
}

// Carrier view — privacy-limited, no bids/audit_log
export interface LoadCarrierDetail {
  id: string;
  job_id: string;
  status: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  cubic_feet: number;
  weight: number | null;
  equipment_type: string;
  pricing_mode: PricingMode;
  fixed_price: number | null;
  special_requirements: string | null;
  posted_at: string;
  bid_count: number;
  poster: BidCarrier;
  booking_id: string | null; // present when status === 'booked'
}

export interface LoadDetailResponse<T = LoadOwnerDetail | LoadCarrierDetail> {
  status: 'success';
  message: string;
  data: T;
}

// Fetch a load by ID. Response shape depends on caller's role:
// - Owner (shipper/broker): full detail with bids + audit_log
// - Carrier: privacy-limited view with poster info
// - Non-owner shipper/broker: 403
export async function getLoad(id: string): Promise<LoadDetailResponse> {
  return apiFetch<LoadDetailResponse>(`/api/marketplace/loads/${id}/`);
}

// ─── PATCH /api/marketplace/loads/:id/ ───────────────────────────────────────

export type PatchLoadPayload = Partial<PostLoadPayload>;

export interface PatchLoadResponse {
  status: 'success';
  message: string;
  data: LoadOwnerDetail;
}

// Partial update of an open load with zero active bids.
// Throws ApiError on 400 (has bids / not open), 403 (not owner), 404 (not found).
export async function patchLoad(id: string, payload: PatchLoadPayload): Promise<PatchLoadResponse> {
  return apiFetch<PatchLoadResponse>(`/api/marketplace/loads/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

