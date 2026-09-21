'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  reviewerName: string;
  reviewerRole: 'shipper' | 'broker' | 'carrier';
  overallRating: number;
  subRatings: { label: string; value: number }[];
  reviewText?: string;
  date: string;
  jobId: string;
}

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', reviewerName: 'Acme Freight LLC', reviewerRole: 'shipper', overallRating: 5, subRatings: [{ label: 'Communication', value: 5 }, { label: 'On-time delivery', value: 5 }, { label: 'Load care', value: 5 }, { label: 'Reliability', value: 5 }], reviewText: 'Excellent carrier. Arrived on time, handled fragile items with care, and communicated proactively throughout the haul.', date: '2026-09-12T10:00:00Z', jobId: 'FTL-2026-0031' },
  { id: 'r2', reviewerName: 'BridgeLogistics', reviewerRole: 'broker', overallRating: 4, subRatings: [{ label: 'Communication', value: 4 }, { label: 'On-time delivery', value: 4 }, { label: 'Load care', value: 5 }, { label: 'Reliability', value: 4 }], reviewText: 'Slight delay on delivery but called ahead to let us know. Would use again for the Chicago corridor.', date: '2026-07-30T14:00:00Z', jobId: 'FTL-2026-0018' },
  { id: 'r3', reviewerName: 'Metro Movers Inc.', reviewerRole: 'shipper', overallRating: 5, subRatings: [{ label: 'Communication', value: 5 }, { label: 'On-time delivery', value: 5 }, { label: 'Load care', value: 4 }, { label: 'Reliability', value: 5 }], reviewText: 'Third time using FastHaul and they never disappoint.', date: '2026-06-15T09:00:00Z', jobId: 'FTL-2026-0009' },
  { id: 'r4', reviewerName: 'TexasPro Movers', reviewerRole: 'shipper', overallRating: 4, subRatings: [{ label: 'Communication', value: 3 }, { label: 'On-time delivery', value: 5 }, { label: 'Load care', value: 4 }, { label: 'Reliability', value: 4 }], reviewText: 'On time and careful with the load, but could improve communication during transit.', date: '2026-05-20T11:00:00Z', jobId: 'FTL-2026-0003' },
  { id: 'r5', reviewerName: 'Pacific Freight Co.', reviewerRole: 'broker', overallRating: 3, subRatings: [{ label: 'Communication', value: 3 }, { label: 'On-time delivery', value: 3 }, { label: 'Load care', value: 3 }, { label: 'Reliability', value: 3 }], reviewText: 'Average experience. Nothing wrong, but nothing exceptional either.', date: '2026-04-10T08:00:00Z', jobId: 'FTL-2026-0001' },
];

const COMPANY = { id: 'c1', name: 'FastHaul LLC', avgRating: 4.2, totalReviews: 38 };

type SortKey = 'newest' | 'highest' | 'lowest';
type RatingFilter = 0 | 1 | 2 | 3 | 4 | 5;

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`} role="img">
      {[1,2,3,4,5].map((n) => <svg key={n} className={sz} viewBox="0 0 20 20" fill={n <= Math.round(rating) ? '#FFCB56' : '#e8e0d6'} aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
    </div>
  );
}

export default function ReviewsViewPage() {
  const [sort, setSort] = useState<SortKey>('newest');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(0);

  let reviews = [...MOCK_REVIEWS];
  if (ratingFilter > 0) reviews = reviews.filter((r) => Math.round(r.overallRating) === ratingFilter);
  if (sort === 'newest') reviews.sort((a, b) => b.date.localeCompare(a.date));
  else if (sort === 'highest') reviews.sort((a, b) => b.overallRating - a.overallRating);
  else if (sort === 'lowest') reviews.sort((a, b) => a.overallRating - b.overallRating);

  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: MOCK_REVIEWS.filter((r) => Math.round(r.overallRating) === s).length,
    pct: Math.round((MOCK_REVIEWS.filter((r) => Math.round(r.overallRating) === s).length / Math.max(MOCK_REVIEWS.length, 1)) * 100),
  }));

  return (
    <div className="mx-auto max-w-[760px] px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href={`/profiles/${COMPANY.id}`} className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          Back to profile
        </Link>
        <h1 className="text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Reviews for {COMPANY.name}
        </h1>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Big number */}
          <div className="flex flex-col items-center gap-1.5 sm:w-32 shrink-0">
            <span className="text-5xl font-bold text-neutral-900">{COMPANY.avgRating.toFixed(1)}</span>
            <StarDisplay rating={COMPANY.avgRating} size="lg" />
            <span className="text-sm text-neutral-400">{COMPANY.totalReviews} reviews</span>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 space-y-2.5">
            {ratingCounts.map((seg) => (
              <button
                key={seg.star}
                type="button"
                onClick={() => setRatingFilter(ratingFilter === seg.star ? 0 : seg.star as RatingFilter)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-[#fafaf8]"
                aria-pressed={ratingFilter === seg.star}
              >
                <span className="w-3 shrink-0 text-right text-xs text-neutral-500">{seg.star}</span>
                <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="#FFCB56" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f3ede4]">
                  <div className="h-full rounded-full transition-all" style={{ width: `${seg.pct}%`, background: ratingFilter === seg.star ? '#2b1508' : '#d97b3f' }} aria-hidden="true" />
                </div>
                <span className="w-6 shrink-0 text-right text-xs text-neutral-400">{seg.count}</span>
              </button>
            ))}
          </div>
        </div>
        {ratingFilter > 0 && (
          <button type="button" onClick={() => setRatingFilter(0)} className="mt-4 text-xs font-medium text-[#d97b3f] underline underline-offset-2 hover:text-[#c2622b]">
            Clear filter (showing {ratingFilter}★ only)
          </button>
        )}
      </div>

      {/* Sort + count */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}{ratingFilter > 0 ? ` with ${ratingFilter}★` : ''}</p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs text-neutral-500">Sort:</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-[#e0d5c8] bg-white px-3.5 py-2 text-sm text-neutral-700 outline-none focus:border-[#d97b3f] appearance-none">
            <option value="newest">Newest first</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
          </select>
        </div>
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-12 text-center">
          <p className="text-sm text-neutral-400">No reviews match your filter.</p>
          <button type="button" onClick={() => setRatingFilter(0)} className="mt-3 text-sm font-semibold text-[#d97b3f] underline underline-offset-2 hover:text-[#c2622b]">Clear filter</button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-neutral-800">{r.reviewerName}</p>
                    <span className="rounded-full bg-[#f3ede4] px-2 py-0.5 text-[10px] font-medium capitalize text-neutral-500">{r.reviewerRole}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StarDisplay rating={r.overallRating} size="sm" />
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs font-mono text-neutral-400">{r.jobId}</span>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-neutral-400">
                  {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {r.reviewText && <p className="mb-3 text-sm leading-relaxed text-neutral-700">"{r.reviewText}"</p>}

              {/* Sub-ratings */}
              {r.subRatings.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {r.subRatings.map((s) => (
                    <div key={s.label} className="rounded-lg border border-[#f0ece6] bg-[#fafaf8] px-3 py-2">
                      <p className="text-[10px] font-medium text-neutral-400">{s.label}</p>
                      <div className="mt-0.5 flex items-center gap-1">
                        <StarDisplay rating={s.value} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
