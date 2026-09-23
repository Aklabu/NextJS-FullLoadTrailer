// Public-facing profile page — viewable by any logged-in user.
// Shows company reputation, reviews, and job history count.
// Detail depth adjusts based on viewer's verification level (handled server-side).

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import VerificationBadge from '@/components/VerificationBadge';
import type { VerificationStatus, UserRole } from '@/lib/types/auth';

interface ReviewItem {
  id: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  role: UserRole;
}

interface ProfileData {
  id: string;
  companyName: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  averageRating: number;
  totalReviews: number;
  jobCount: number;
  memberSince: string;
  recentReviews: ReviewItem[];
}

// Stub data — replace with GET /api/profiles/:id/
const MOCK_PROFILE: ProfileData = {
  id: '1',
  companyName: 'FastHaul Logistics LLC',
  role: 'carrier',
  verificationStatus: 'verified',
  averageRating: 4.7,
  totalReviews: 38,
  jobCount: 112,
  memberSince: 'March 2025',
  recentReviews: [
    { id: 'r1', reviewerName: 'Acme Freight', rating: 5, comment: 'On time, professional driver, great communication throughout.', date: 'Aug 12, 2026', role: 'shipper' },
    { id: 'r2', reviewerName: 'Bridge Logistics', rating: 4, comment: 'Smooth pickup, slight delay on delivery but communicated proactively.', date: 'Jul 29, 2026', role: 'broker' },
    { id: 'r3', reviewerName: 'Metro Movers', rating: 5, comment: 'Excellent carrier. Will use again on Atlanta corridor.', date: 'Jul 15, 2026', role: 'shipper' },
  ],
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={`${sz} shrink-0`} viewBox="0 0 20 20" fill={n <= Math.round(rating) ? '#FFCB56' : '#e8e0d6'} aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const ROLE_LABELS: Record<UserRole, string> = {
  shipper: 'Shipper / Moving Co.',
  broker: 'Freight Broker',
  carrier: 'Carrier / Owner-Op',
};

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const [profile] = useState<ProfileData>(MOCK_PROFILE);
  const [loading] = useState(false);

  // Scroll to reviews when hash changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#reviews') {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[680px] animate-pulse space-y-4 px-6 py-10">
        <div className="h-32 rounded-2xl bg-neutral-100" />
        <div className="h-48 rounded-2xl bg-neutral-100" />
      </div>
    );
  }

  const ratingSegments = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: profile.recentReviews.filter((r) => Math.round(r.rating) === star).length,
    pct: Math.round((profile.recentReviews.filter((r) => Math.round(r.rating) === star).length / Math.max(profile.recentReviews.length, 1)) * 100),
  }));

  return (
    <div className="mx-auto max-w-[680px] space-y-6 px-6 py-10">

      {/* Identity card */}
      <div className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl font-bold text-white"
            style={{ background: '#2b1508' }}
            aria-hidden="true"
          >
            {profile.companyName.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2">
              <h1
                className="text-xl font-normal text-neutral-900 leading-tight"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {profile.companyName}
              </h1>
              <VerificationBadge status={profile.verificationStatus} />
            </div>

            <p className="mt-1 text-sm text-neutral-500">{ROLE_LABELS[profile.role]}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={profile.averageRating} size="sm" />
                <span className="text-sm font-semibold text-neutral-800">{profile.averageRating.toFixed(1)}</span>
                <span className="text-sm text-neutral-400">({profile.totalReviews} reviews)</span>
              </div>
              <span className="text-neutral-200">|</span>
              <span className="text-sm text-neutral-500">{profile.jobCount} jobs completed</span>
              <span className="text-neutral-200">|</span>
              <span className="text-sm text-neutral-500">Member since {profile.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/messages/new?recipient=${params?.id}`}
            className="flex items-center gap-2 rounded-xl border border-[#e0d5c8] bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Message
          </Link>
          {profile.role === 'carrier' && (
            <Link
              href={`/marketplace/loads?carrier=${params?.id}`}
              className="flex items-center gap-2 rounded-xl py-2.5 px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
              style={{ background: '#fc3f07' }}
            >
              View active capacity →
            </Link>
          )}
          {(profile.role === 'shipper' || profile.role === 'broker') && (
            <Link
              href={`/marketplace/my-loads?shipper=${params?.id}`}
              className="flex items-center gap-2 rounded-xl py-2.5 px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
              style={{ background: '#fc3f07' }}
            >
              View active loads →
            </Link>
          )}
        </div>
      </div>

      {/* Rating breakdown + reviews */}
      <div id="reviews" className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
        <h2
          className="mb-5 text-base font-semibold text-neutral-800"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Reviews
        </h2>

        {profile.totalReviews === 0 ? (
          <p className="text-sm text-neutral-400">No reviews yet.</p>
        ) : (
          <>
            {/* Summary row */}
            <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* Big number */}
              <div className="flex flex-col items-center gap-1 sm:w-28 shrink-0">
                <span className="text-4xl font-bold text-neutral-900">{profile.averageRating.toFixed(1)}</span>
                <StarRating rating={profile.averageRating} size="sm" />
                <span className="text-xs text-neutral-400">{profile.totalReviews} reviews</span>
              </div>

              {/* Breakdown bars */}
              <div className="flex-1 space-y-2">
                {ratingSegments.map((seg) => (
                  <div key={seg.star} className="flex items-center gap-3">
                    <span className="w-3 shrink-0 text-right text-xs text-neutral-500">{seg.star}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f3ede4]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${seg.pct}%`, background: '#fc3f07' }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="w-7 shrink-0 text-xs text-neutral-400">{seg.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review list */}
            <div className="space-y-4">
              {profile.recentReviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-[#f0ece6] bg-[#fdfcfb] p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{r.reviewerName}</p>
                      <p className="text-[11px] text-neutral-400 capitalize">{r.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StarRating rating={r.rating} size="sm" />
                      <span className="text-[11px] text-neutral-400">{r.date}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-600">{r.comment}</p>
                </div>
              ))}
            </div>

            {profile.totalReviews > profile.recentReviews.length && (
              <Link
                href={`/profiles/${params?.id}/reviews`}
                className="mt-4 block text-center text-sm font-medium text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]"
              >
                See all {profile.totalReviews} reviews →
              </Link>
            )}
          </>
        )}
      </div>

    </div>
  );
}
