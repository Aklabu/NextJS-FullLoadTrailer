'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getReviewStatus, postReview } from '@/features/messaging/api/reviewsAPI';
import type { ReviewStatusData, SubRatings } from '@/features/messaging/api/reviewsAPI';

// Sub-ratings differ by the reviewer's role
const SHIPPER_SUB_RATINGS = [
  { key: 'communication', label: 'Communication' },
  { key: 'reliability', label: 'Reliability' },
  { key: 'on_time', label: 'On-time delivery' },
  { key: 'load_care', label: 'Load care' },
];

const CARRIER_SUB_RATINGS = [
  { key: 'communication', label: 'Communication' },
  { key: 'payment_speed', label: 'Payment speed' },
  { key: 'load_accuracy', label: 'Load accuracy' },
  { key: 'professionalism', label: 'Professionalism' },
];

function StarInput({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star${n !== 1 ? 's' : ''}`}
          aria-pressed={value === n}
          className="transition-transform hover:scale-110"
        >
          <svg className="h-6 w-6" viewBox="0 0 20 20" fill={n <= display ? '#ff3d03' : '#e8e0d6'} aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="ml-1 text-sm font-medium text-neutral-600">
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ReviewSkeleton() {
  return (
    <div className="mx-auto max-w-[560px] animate-pulse px-6 py-10">
      <div className="mb-4 h-5 w-32 rounded bg-neutral-200" />
      <div className="mb-2 h-8 w-48 rounded bg-neutral-200" />
      <div className="mb-8 h-4 w-64 rounded bg-neutral-200" />
      <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm space-y-5">
        <div className="h-4 w-28 rounded bg-neutral-200" />
        <div className="flex gap-1">{[1,2,3,4,5].map(n => <div key={n} className="h-6 w-6 rounded bg-neutral-200" />)}</div>
        <div className="h-px bg-[#f0ece6]" />
        {[1,2,3,4].map(n => (
          <div key={n} className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-neutral-200" />
            <div className="flex gap-1">{[1,2,3,4,5].map(s => <div key={s} className="h-6 w-6 rounded bg-neutral-200" />)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaveReviewPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params?.jobId ?? '';

  // Status fetch state
  const [statusData, setStatusData] = useState<ReviewStatusData | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState('');

  // Form state
  const [overallRating, setOverallRating] = useState(0);
  const [subRatingValues, setSubRatingValues] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!jobId) return;
    setStatusLoading(true);
    getReviewStatus(jobId)
      .then((data) => setStatusData(data))
      .catch((err) => setStatusError(err?.message ?? 'Failed to load review status.'))
      .finally(() => setStatusLoading(false));
  }, [jobId]);

  function setSubRating(key: string, val: number) {
    setSubRatingValues((p) => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (overallRating === 0) { setFormError('Please select an overall star rating.'); return; }
    if (!statusData) return;

    setSubmitting(true); setFormError('');
    try {
      await postReview(jobId, {
        overall_rating: overallRating,
        sub_ratings: Object.keys(subRatingValues).length > 0
          ? (subRatingValues as SubRatings)
          : undefined,
        review_text: reviewText.trim() || null,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setFormError(apiErr?.message ?? 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (statusLoading) return <ReviewSkeleton />;

  // ─── Status fetch error ────────────────────────────────────────────────────

  if (statusError || !statusData) {
    return (
      <div className="mx-auto max-w-[520px] px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-xl text-2xl" style={{ background: '#fef2f2' }} aria-hidden="true">⚠️</div>
        <p className="text-base font-medium text-neutral-700">Unable to load review</p>
        <p className="mt-2 text-sm text-neutral-500">{statusError || 'This job could not be found or you are not a participant.'}</p>
        <Link href="/dashboard" className="mt-6 inline-block text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">Back to dashboard</Link>
      </div>
    );
  }

  const subRatings = statusData.reviewer_role === 'shipper' ? SHIPPER_SUB_RATINGS : CARRIER_SUB_RATINGS;

  // ─── Not eligible — job not yet completed ─────────────────────────────────

  if (!statusData.eligible) {
    return (
      <div className="mx-auto max-w-[520px] px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">🔒</div>
        <p className="text-base font-medium text-neutral-700">Review not yet available</p>
        <p className="mt-2 text-sm text-neutral-500">Reviews can only be submitted after both parties have confirmed job completion.</p>
        <Link href="/dashboard" className="mt-6 inline-block text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">Back to dashboard</Link>
      </div>
    );
  }

  // ─── Already reviewed ─────────────────────────────────────────────────────

  if (statusData.already_reviewed) {
    return (
      <div className="mx-auto max-w-[520px] px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <p className="text-base font-medium text-neutral-700">You've already reviewed this job</p>
        <p className="mt-2 text-sm text-neutral-500">
          Your review for <span className="font-semibold">{statusData.counterparty.company_name}</span> on job{' '}
          <span className="font-mono">{statusData.job_id}</span> has been submitted.
        </p>
        <Link href={`/profiles/${statusData.counterparty.id}`} className="mt-6 inline-block text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">View their profile →</Link>
      </div>
    );
  }

  // ─── Post-submit success ───────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="mx-auto max-w-[480px] px-6 py-16 text-center">
        <div className="mb-5 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="mb-2 text-2xl font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Review submitted</h1>
        <p className="mb-8 text-sm text-neutral-500">
          Your review for {statusData.counterparty.company_name} has been published on their profile.
        </p>
        <div className="flex flex-col gap-3">
          <Link href={`/profiles/${statusData.counterparty.id}`} className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]" style={{ background: '#fc3f07' }}>View their profile →</Link>
          <Link href="/dashboard" className="rounded-xl border border-[#e0d5c8] py-3 text-center text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  // ─── Review form ───────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-[560px] px-6 py-10">
      <div className="mb-8">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
          <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />POST-JOB REVIEW
        </span>
        <h1 className="mt-2 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Leave a review
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Rating <span className="font-semibold text-neutral-700">{statusData.counterparty.company_name}</span> for job{' '}
          <span className="font-mono text-neutral-700">{statusData.job_id}</span> · {statusData.origin} → {statusData.destination}
        </p>
      </div>

      <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm">
        {formError && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <p className="text-sm text-red-700">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Overall rating */}
          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-700">
              Overall rating <span className="text-red-500" aria-hidden="true">*</span>
            </p>
            <StarInput value={overallRating} onChange={(v) => { setOverallRating(v); setFormError(''); }} label="Overall rating" />
          </div>

          <div className="h-px bg-[#f0ece6]" />

          {/* Sub-ratings */}
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-700">Detailed ratings</p>
            <div className="space-y-4">
              {subRatings.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-600">{s.label}</span>
                  <StarInput value={subRatingValues[s.key] ?? 0} onChange={(v) => setSubRating(s.key, v)} label={s.label} />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#f0ece6]" />

          {/* Text */}
          <div>
            <label htmlFor="reviewText" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Written review <span className="text-neutral-400 text-xs">(optional)</span>
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              placeholder="Describe your experience working with this company…"
              className="w-full resize-none rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20"
            />
            <p className="mt-1.5 text-xs text-neutral-400">Your review will be published on their public profile.</p>
          </div>

          <button
            type="submit"
            disabled={submitting || overallRating === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506]"
            style={{ background: '#fc3f07' }}
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </>
            ) : 'Submit review'}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-xs text-neutral-400">
        Reviews are validated server-side and tied to a real completed job. Abuse will result in removal.
      </p>
    </div>
  );
}
