'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCompanyReviews } from '@/features/messaging/api/reviewsAPI';
import type {
  CompanyReview,
  ReviewSummary,
  ReviewSortKey,
} from '@/features/messaging/api/reviewsAPI';

type StarFilter = 0 | 1 | 2 | 3 | 4 | 5;

const PAGE_SIZE = 10;

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={sz} viewBox="0 0 20 20" fill={n <= Math.round(rating) ? '#ff3d03' : '#e8e0d6'} aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm space-y-3">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-36 rounded bg-neutral-200" />
          <div className="h-3 w-24 rounded bg-neutral-200" />
        </div>
        <div className="h-3 w-16 rounded bg-neutral-200" />
      </div>
      <div className="h-4 w-full rounded bg-neutral-200" />
      <div className="h-4 w-3/4 rounded bg-neutral-200" />
      <div className="grid grid-cols-4 gap-2">
        {[1,2,3,4].map((n) => <div key={n} className="h-12 rounded-lg bg-neutral-100" />)}
      </div>
    </div>
  );
}

export default function ReviewsViewPage() {
  const params = useParams<{ id: string }>();
  const companyId = params?.id ?? '';

  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const [sort, setSort] = useState<ReviewSortKey>('newest');
  const [starFilter, setStarFilter] = useState<StarFilter>(0);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // companyName is filled from the first successful fetch
  const [companyName, setCompanyName] = useState('');

  const fetchReviews = useCallback(async (
    opts: { page: number; sort: ReviewSortKey; star: StarFilter; replace: boolean }
  ) => {
    if (!companyId) return;
    opts.replace ? setLoading(true) : setLoadingMore(true);
    setError('');
    try {
      const data = await getCompanyReviews(companyId, {
        page: opts.page,
        sort: opts.sort,
        star: opts.star > 0 ? (opts.star as 1 | 2 | 3 | 4 | 5) : undefined,
      });
      // summary always reflects the full set — keep it from the first load
      // or any load where it's present (server always returns it)
      setSummary(data.summary);
      setTotalCount(data.count);
      setHasNext(data.next !== null);
      if (opts.replace) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? 'Failed to load reviews.');
    } finally {
      opts.replace ? setLoading(false) : setLoadingMore(false);
    }
  }, [companyId]);

  // Initial load and whenever sort/filter changes — reset to page 1
  useEffect(() => {
    setPage(1);
    fetchReviews({ page: 1, sort, star: starFilter, replace: true });
  }, [sort, starFilter, fetchReviews]);

  // Load more (page > 1)
  useEffect(() => {
    if (page === 1) return;
    fetchReviews({ page, sort, star: starFilter, replace: false });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Grab company name from profile link param if available, else use summary placeholder
  useEffect(() => {
    if (!companyName && reviews.length > 0) {
      // Company name is not in the reviews payload — set placeholder until
      // PublicProfilePage passes it via search param or context
      setCompanyName('this company');
    }
  }, [reviews, companyName]);

  function handleStarFilter(star: number) {
    const next = starFilter === star ? 0 : (star as StarFilter);
    setStarFilter(next);
  }

  function handleSortChange(value: ReviewSortKey) {
    setSort(value);
  }

  const distribution = summary
    ? ([5, 4, 3, 2, 1] as const).map((s) => ({
        star: s,
        count: summary.distribution[String(s) as '1' | '2' | '3' | '4' | '5'],
        pct: Math.round(
          (summary.distribution[String(s) as '1' | '2' | '3' | '4' | '5'] /
            Math.max(summary.review_count, 1)) * 100
        ),
      }))
    : [];

  // ─── Error state ────────────────────────────────────────────────────────────

  if (!loading && error && reviews.length === 0) {
    return (
      <div className="mx-auto max-w-[520px] px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-xl text-2xl" style={{ background: '#fef2f2' }} aria-hidden="true">⚠️</div>
        <p className="text-base font-medium text-neutral-700">Failed to load reviews</p>
        <p className="mt-2 text-sm text-neutral-500">{error}</p>
        <Link href={`/profiles/${companyId}`} className="mt-6 inline-block text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">Back to profile</Link>
      </div>
    );
  }

  const filteredCount = starFilter > 0 ? reviews.length : totalCount;

  return (
    <div className="mx-auto max-w-[760px] px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href={`/profiles/${companyId}`} className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to profile
        </Link>
        <h1 className="text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {summary ? `Reviews (${summary.review_count})` : 'Reviews'}
        </h1>
      </div>

      {/* Summary card */}
      <div className="mb-6 rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
        {loading || !summary ? (
          <div className="animate-pulse flex gap-6">
            <div className="flex flex-col items-center gap-2 w-32">
              <div className="h-12 w-16 rounded bg-neutral-200" />
              <div className="h-4 w-20 rounded bg-neutral-200" />
              <div className="h-3 w-14 rounded bg-neutral-200" />
            </div>
            <div className="flex-1 space-y-3">
              {[5,4,3,2,1].map((s) => <div key={s} className="flex items-center gap-3"><div className="h-2 w-3 rounded bg-neutral-200" /><div className="h-2 flex-1 rounded bg-neutral-200" /><div className="h-2 w-6 rounded bg-neutral-200" /></div>)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Big number */}
            <div className="flex flex-col items-center gap-1.5 sm:w-32 shrink-0">
              <span className="text-5xl font-bold text-neutral-900">{summary.avg_rating.toFixed(1)}</span>
              <StarDisplay rating={summary.avg_rating} size="lg" />
              <span className="text-sm text-neutral-400">{summary.review_count} reviews</span>
            </div>

            {/* Breakdown bars — always full set, star buttons act as filter */}
            <div className="flex-1 space-y-2.5">
              {distribution.map((seg) => (
                <button
                  key={seg.star}
                  type="button"
                  onClick={() => handleStarFilter(seg.star)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-[#fafaf8]"
                  aria-pressed={starFilter === seg.star}
                >
                  <span className="w-3 shrink-0 text-right text-xs text-neutral-500">{seg.star}</span>
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="#ff3d03" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f3ede4]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${seg.pct}%`, background: starFilter === seg.star ? '#2b1508' : '#fc3f07' }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs text-neutral-400">{seg.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {starFilter > 0 && (
          <button
            type="button"
            onClick={() => setStarFilter(0)}
            className="mt-4 text-xs font-medium text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]"
          >
            Clear filter (showing {starFilter}★ only)
          </button>
        )}
      </div>

      {/* Sort + count */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          {loading ? (
            <span className="inline-block h-4 w-24 animate-pulse rounded bg-neutral-200" />
          ) : (
            <>{totalCount} review{totalCount !== 1 ? 's' : ''}{starFilter > 0 ? ` with ${starFilter}★` : ''}</>
          )}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs text-neutral-500">Sort:</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as ReviewSortKey)}
            className="rounded-xl border border-[#e0d5c8] bg-white px-3.5 py-2 text-sm text-neutral-700 outline-none focus:border-[#fc3f07] appearance-none"
          >
            <option value="newest">Newest first</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
          </select>
        </div>
      </div>

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => <ReviewCardSkeleton key={n} />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-12 text-center">
          <p className="text-sm text-neutral-400">
            {starFilter > 0 ? 'No reviews match this filter.' : 'No reviews yet.'}
          </p>
          {starFilter > 0 && (
            <button
              type="button"
              onClick={() => setStarFilter(0)}
              className="mt-3 text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-800">{r.reviewer_name}</p>
                      <span className="rounded-full bg-[#f3ede4] px-2 py-0.5 text-[10px] font-medium capitalize text-neutral-500">{r.reviewer_role}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarDisplay rating={r.overall_rating} size="sm" />
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs font-mono text-neutral-400">{r.job_id}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {r.review_text && (
                  <p className="mb-3 text-sm leading-relaxed text-neutral-700">"{r.review_text}"</p>
                )}

                {r.sub_ratings.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {r.sub_ratings.map((s) => (
                      <div key={s.label} className="rounded-lg border border-[#f0ece6] bg-[#fafaf8] px-3 py-2">
                        <p className="text-[10px] font-medium text-neutral-400">{s.label}</p>
                        <div className="mt-0.5">
                          <StarDisplay rating={s.value} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load more */}
          {hasNext && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={loadingMore}
                className="flex items-center gap-2 rounded-xl border border-[#e0d5c8] bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07] disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading…
                  </>
                ) : `Load more reviews`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
