// GET /marketplace/loads/browse/ — Carrier only
// Returns paginated loads with status 'open' or 'bidding'.
// 403 if caller is not a verified carrier.

import { apiFetch } from '@/lib/api/client';
import type { PricingMode } from '@/features/marketplace/types';

export type BrowseSortOption = 'newest' | 'pickup_asc' | 'cuft_desc';

export interface BrowseLoadsParams {
  origin?: string;
  destination?: string;
  equipment_type?: string;
  pickup_from?: string;
  pickup_to?: string;
  min_cubic_feet?: number;
  max_cubic_feet?: number;
  sort?: BrowseSortOption;
  page?: number;
}

export interface BrowseLoadPoster {
  id: string;
  company_name: string;
  verification_status: string;
  avg_rating: number | null;
}

export interface BrowseLoadItem {
  id: string;
  job_id: string;
  status: 'open' | 'bidding';
  origin: string;
  destination: string;
  cubic_feet: number;
  equipment_type: string;
  pickup_date: string;
  pricing_mode: PricingMode;
  fixed_price: number | null;
  posted_at: string;
  bid_count: number;
  poster: BrowseLoadPoster;
}

export interface BrowseLoadsResponse {
  status: 'success';
  message: string;
  data: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: BrowseLoadItem[];
  };
}

export async function browseLoads(params?: BrowseLoadsParams): Promise<BrowseLoadsResponse> {
  const qs = new URLSearchParams();
  if (params?.origin) qs.set('origin', params.origin);
  if (params?.destination) qs.set('destination', params.destination);
  if (params?.equipment_type) qs.set('equipment_type', params.equipment_type);
  if (params?.pickup_from) qs.set('pickup_from', params.pickup_from);
  if (params?.pickup_to) qs.set('pickup_to', params.pickup_to);
  if (params?.min_cubic_feet != null) qs.set('min_cubic_feet', String(params.min_cubic_feet));
  if (params?.max_cubic_feet != null) qs.set('max_cubic_feet', String(params.max_cubic_feet));
  if (params?.sort) qs.set('sort', params.sort);
  if (params?.page != null) qs.set('page', String(params.page));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch<BrowseLoadsResponse>(`/api/marketplace/loads/browse/${query}`);
}

// POST /marketplace/loads/{load_id}/bids/
// Places a new bid. Transitions load open → bidding on first bid.
// Carrier can only have one active bid per load.

export interface PlaceBidPayload {
  amount: string; // decimal string e.g. "1500.00"
  note?: string;
}

export interface BidCarrier {
  id: string;
  company_name: string;
  verification_status: string;
  avg_rating: number | null;
}

export interface PlacedBid {
  id: string;
  carrier: BidCarrier;
  amount: string;
  counter_amount: string | null;
  status: 'pending';
  note: string;
  placed_at: string;
}

export interface PlaceBidResponse {
  status: 'success';
  message: string;
  data: PlacedBid;
}

export async function placeBid(loadId: string, payload: PlaceBidPayload): Promise<PlaceBidResponse> {
  return apiFetch<PlaceBidResponse>(`/api/marketplace/loads/${loadId}/bids/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// GET /marketplace/loads/{load_id}/bids/mine/
// Returns the carrier's own bid on the given load.
// Poll this to detect status changes (e.g. countered).

export type BidStatus = 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';

export interface MyBid {
  id: string;
  amount: string;
  counter_amount: string | null;
  status: BidStatus;
  note: string;
  placed_at: string;
  booking_id?: string; // present when status === 'accepted'
}

export interface GetMyBidResponse {
  status: 'success';
  message: string;
  data: MyBid;
}

export async function getMyBid(loadId: string): Promise<GetMyBidResponse> {
  return apiFetch<GetMyBidResponse>(`/api/marketplace/loads/${loadId}/bids/mine/`);
}

// POST /marketplace/loads/{load_id}/bids/mine/withdraw/
// Withdraws the carrier's active (pending or countered) bid.
// Load reverts to open if no active bids remain.

export interface WithdrawBidResponse {
  status: 'success';
  message: string;
  data: MyBid & { status: 'withdrawn' };
}

export async function withdrawBid(loadId: string): Promise<WithdrawBidResponse> {
  return apiFetch<WithdrawBidResponse>(`/api/marketplace/loads/${loadId}/bids/mine/withdraw/`, {
    method: 'POST',
  });
}

// GET /marketplace/carrier/my-bids/
// Returns the carrier's bids grouped by tab.

export type MyBidsTab = 'active' | 'won' | 'lost' | 'withdrawn';

export interface MyBidListItem {
  id: string;
  load_id: string;
  job_id: string;
  origin: string;
  destination: string;
  pickup_date: string;
  equipment_type: string;
  bid_amount: string;
  counter_amount: string | null;
  bid_status: BidStatus;
  load_status: string;
  placed_at: string;
  booking_id: string | null; // present when bid_status === 'accepted'
}

export interface MyBidsCounts {
  active: number;
  won: number;
  lost: number;
  withdrawn: number;
}

export interface GetMyBidsResponse {
  status: 'success';
  message: string;
  data: {
    counts: MyBidsCounts;
    bids: MyBidListItem[];
  };
}

export async function getMyBids(tab?: MyBidsTab): Promise<GetMyBidsResponse> {
  const query = tab ? `?tab=${tab}` : '';
  return apiFetch<GetMyBidsResponse>(`/api/marketplace/carrier/my-bids/${query}`);
}

// POST /marketplace/loads/{load_id}/bids/mine/accept-counter/
// Carrier accepts the shipper's counter-offer. Creates booking atomically.
// 404 if no countered bid or load not found.

export interface AcceptCounterResponse {
  status: 'success';
  message: string;
  data: { booking_id: string };
}

export async function acceptCounter(loadId: string): Promise<AcceptCounterResponse> {
  return apiFetch<AcceptCounterResponse>(
    `/api/marketplace/loads/${loadId}/bids/mine/accept-counter/`,
    { method: 'POST' },
  );
}
