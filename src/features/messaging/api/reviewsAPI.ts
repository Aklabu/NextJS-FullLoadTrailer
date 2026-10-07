// Reviews API — endpoints for review eligibility checks and submission
// All endpoints require a valid JWT (handled by apiFetch).

import { apiFetch } from '@/lib/api/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewCounterparty {
  id: string;
  company_name: string;
  role: 'shipper' | 'broker' | 'carrier';
}

// Response from GET /api/marketplace/jobs/:jobId/review-status/
// eligible: false means the job isn't completed yet
// already_reviewed: true means this user already submitted a review for this job
export interface ReviewStatusData {
  eligible: boolean;
  already_reviewed: boolean;
  job_id: string;
  origin: string;
  destination: string;
  completed_at: string;
  counterparty: ReviewCounterparty;
  reviewer_role: 'shipper' | 'broker' | 'carrier';
}

export interface ReviewStatusResponse {
  success: boolean;
  message: string;
  data: ReviewStatusData;
}

// ─── GET /api/marketplace/jobs/:jobId/review-status/ ─────────────────────────

// Check whether the authenticated user can leave a review for a completed job.
// Throws ApiError on:
//   404 — job_id not found, or no booking exists for the load
//   403 — caller's company is not a participant on this job
export async function getReviewStatus(jobId: string): Promise<ReviewStatusData> {
  const res = await apiFetch<ReviewStatusResponse>(
    `/api/marketplace/jobs/${jobId}/review-status/`
  );
  return res.data;
}

// ─── POST /api/marketplace/jobs/:jobId/review/ ────────────────────────────────

// Sub-rating keys for carrier reviewees (reviewer is a shipper/broker)
export interface CarrierSubRatings {
  communication?: number;
  reliability?: number;
  on_time?: number;
  load_care?: number;
}

// Sub-rating keys for shipper/broker reviewees (reviewer is a carrier)
export interface ShipperSubRatings {
  communication?: number;
  payment_speed?: number;
  load_accuracy?: number;
  professionalism?: number;
}

// Union used in the form — keys from both sets may be present at runtime
export type SubRatings = CarrierSubRatings & ShipperSubRatings;

export interface PostReviewPayload {
  overall_rating: number; // required, 1–5
  sub_ratings?: SubRatings;
  review_text?: string | null;
}

// Saved review returned on 201
export interface ReviewData {
  id: string;
  job_id: string;
  reviewee_id: string;
  overall_rating: number;
  sub_ratings: SubRatings;
  review_text: string | null;
  created_at: string;
}

export interface PostReviewResponse {
  success: boolean;
  message: string;
  data: ReviewData;
}

// Submit a review for a completed job. Returns the saved review on 201.
// Server re-validates eligibility — do not rely solely on getReviewStatus flags.
// Throws ApiError on:
//   403 (code: not_eligible) — job not yet completed
//   400 (code: already_reviewed) — duplicate submission
//   400 (code: invalid_sub_ratings) — wrong keys for the reviewee's role
//   400 — overall_rating out of range or other validation failure
//   403/404 — not a participant / job not found
export async function postReview(jobId: string, payload: PostReviewPayload): Promise<ReviewData> {
  const res = await apiFetch<PostReviewResponse>(`/api/marketplace/jobs/${jobId}/review/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

// ─── GET /api/profiles/:companyId/ ───────────────────────────────────────────

export interface PublicProfileData {
  id: string;
  company_name: string;
  role: 'shipper' | 'broker' | 'carrier';
  verification_status: string;
  avg_rating: number | null;
  review_count: number;
  member_since: string;
  job_count: number;
}

export interface PublicProfileResponse {
  success: boolean;
  message: string;
  data: PublicProfileData;
}

// Fetch the public profile of any company.
// Throws ApiError on 404 — company_id not found.
export async function getPublicProfile(companyId: string): Promise<PublicProfileData> {
  const res = await apiFetch<PublicProfileResponse>(`/api/profiles/${companyId}/`);
  return res.data;
}

// ─── GET /api/profiles/:companyId/reviews/ ───────────────────────────────────

export interface ReviewSummary {
  avg_rating: number;
  review_count: number;
  // distribution is always the full-set counts, independent of any star filter
  distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
}

export interface ReviewSubRating {
  label: string;
  value: number;
}

export interface CompanyReview {
  id: string;
  reviewer_name: string;
  reviewer_role: 'shipper' | 'broker' | 'carrier';
  overall_rating: number;
  sub_ratings: ReviewSubRating[];
  review_text: string | null;
  date: string;
  job_id: string;
}

export interface CompanyReviewsData {
  summary: ReviewSummary;
  reviews: CompanyReview[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface CompanyReviewsResponse {
  success: boolean;
  message: string;
  data: CompanyReviewsData;
}

export type ReviewSortKey = 'newest' | 'highest' | 'lowest';

export interface GetCompanyReviewsParams {
  page?: number;
  sort?: ReviewSortKey;
  star?: 1 | 2 | 3 | 4 | 5;
}

// Fetch paginated reviews for a company.
// distribution in summary always reflects the full set regardless of star filter.
// Throws ApiError on 404 — company_id not found.
export async function getCompanyReviews(
  companyId: string,
  params?: GetCompanyReviewsParams
): Promise<CompanyReviewsData> {
  const qs = new URLSearchParams();
  if (params?.page && params.page > 1) qs.set('page', String(params.page));
  if (params?.sort && params.sort !== 'newest') qs.set('sort', params.sort);
  if (params?.star) qs.set('star', String(params.star));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  const res = await apiFetch<CompanyReviewsResponse>(
    `/api/profiles/${companyId}/reviews/${query}`
  );
  return res.data;
}
