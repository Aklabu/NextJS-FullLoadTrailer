// Bid handling endpoints — Load owner (Shipper / Broker) actions on incoming bids.

import { apiFetch } from '@/lib/api/client';

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface BidActionResult {
  id: string;
  amount: string;
  counter_amount: string | null;
  status: string;
  note: string;
  placed_at: string;
}

// ─── POST /marketplace/loads/{load_id}/bids/{bid_id}/reject/ ─────────────────
// Rejects a bid. Load owner only.
// 404 if bid not found, 403 if not the load owner.

export interface RejectBidResponse {
  status: 'success';
  message: string;
  data: BidActionResult & { status: 'rejected' };
}

export async function rejectBid(loadId: string, bidId: string): Promise<RejectBidResponse> {
  return apiFetch<RejectBidResponse>(
    `/api/marketplace/loads/${loadId}/bids/${bidId}/reject/`,
    { method: 'POST' },
  );
}

// ─── POST /marketplace/loads/{load_id}/bids/{bid_id}/counter/ ────────────────
// Sends a counter-offer to the carrier. Bid status becomes countered.
// 400 if load already booked or counter_amount invalid, 404 if bid not found.

export interface CounterBidPayload {
  counter_amount: string; // decimal string e.g. "1350.00"
}

export interface CounterBidCarrier {
  id: string;
  company_name: string;
  verification_status: string;
  avg_rating: number | null;
}

export interface CounterBidResponse {
  status: 'success';
  message: string;
  data: BidActionResult & {
    status: 'countered';
    carrier: CounterBidCarrier;
  };
}

export async function counterBid(
  loadId: string,
  bidId: string,
  payload: CounterBidPayload,
): Promise<CounterBidResponse> {
  return apiFetch<CounterBidResponse>(
    `/api/marketplace/loads/${loadId}/bids/${bidId}/counter/`,
    { method: 'POST', body: JSON.stringify(payload) },
  );
}

// ─── POST /marketplace/loads/{load_id}/bids/{bid_id}/accept/ ─────────────────
// Atomically accepts this bid, rejects all others, creates a Booking.
// Load transitions to booked. Returns the new booking_id.
// 400 if already booked or bid not acceptable, 403/404 as above.

export interface AcceptBidResponse {
  status: 'success';
  message: string;
  data: { booking_id: string };
}

export async function acceptBid(loadId: string, bidId: string): Promise<AcceptBidResponse> {
  return apiFetch<AcceptBidResponse>(
    `/api/marketplace/loads/${loadId}/bids/${bidId}/accept/`,
    { method: 'POST' },
  );
}
