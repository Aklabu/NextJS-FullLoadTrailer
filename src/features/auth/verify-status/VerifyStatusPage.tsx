'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { VerificationStatus } from '@/lib/types/auth';

interface VerificationData {
  status: VerificationStatus;
  rejectionReason?: string;
  infoRequested?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

// Status config for banner + icon
const STATUS_CONFIG: Record<
  VerificationStatus,
  {
    icon: React.ReactNode;
    iconBg: string;
    bannerBg: string;
    bannerBorder: string;
    headingColor: string;
    heading: string;
    subheading: string;
  }
> = {
  pending: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-amber-50',
    bannerBg: 'bg-amber-50',
    bannerBorder: 'border-amber-200',
    headingColor: 'text-amber-800',
    heading: 'Your application is under review',
    subheading: 'Our team is reviewing your submitted information and documents. This usually takes 1–2 business days.',
  },
  verified: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-emerald-50',
    bannerBg: 'bg-emerald-50',
    bannerBorder: 'border-emerald-200',
    headingColor: 'text-emerald-800',
    heading: 'Account approved',
    subheading: "You're verified and ready to use the platform. Redirecting to your dashboard…",
  },
  rejected: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-red-50',
    bannerBg: 'bg-red-50',
    bannerBorder: 'border-red-200',
    headingColor: 'text-red-800',
    heading: 'Application rejected',
    subheading: 'Your application was not approved. Please review the reason below and resubmit with corrected information.',
  },
  needs_info: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-orange-50',
    bannerBg: 'bg-orange-50',
    bannerBorder: 'border-orange-200',
    headingColor: 'text-orange-800',
    heading: 'Additional information needed',
    subheading: 'Our team needs a bit more from you before we can complete the review.',
  },
  basic: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    iconBg: 'bg-sky-50',
    bannerBg: 'bg-sky-50',
    bannerBorder: 'border-sky-200',
    headingColor: 'text-sky-800',
    heading: 'Basic tier active',
    subheading: 'You have access to the Bulletin Board. Upgrade to Advanced to unlock the full marketplace.',
  },
  unverified: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-neutral-50',
    bannerBg: 'bg-neutral-50',
    bannerBorder: 'border-neutral-200',
    headingColor: 'text-neutral-700',
    heading: 'Account not yet submitted',
    subheading: 'Complete your registration to submit your account for review.',
  },
};

// What happens next — per status
function NextSteps({ status }: { status: VerificationStatus }) {
  if (status === 'verified' || status === 'basic') return null;

  const steps: Record<string, { icon: string; title: string; body: string }[]> = {
    pending: [
      { icon: '🔍', title: 'Documents reviewed', body: 'Our compliance team checks your submitted insurance, authority, and license documents.' },
      { icon: '✅', title: 'Identity confirmed', body: 'We cross-reference your DOT/MC numbers or business license with public records.' },
      { icon: '📧', title: 'Decision emailed', body: "You'll receive an email once a decision is made. Check your spam folder if you haven't heard back." },
    ],
    needs_info: [
      { icon: '📋', title: 'Review the request below', body: 'Read the specific information our team is asking for.' },
      { icon: '📎', title: 'Re-upload or correct', body: 'Use the button below to add missing documents or correct information.' },
      { icon: '⏱', title: 'Re-review within 24 hours', body: 'Once you resubmit, our team will prioritize your application.' },
    ],
    rejected: [
      { icon: '📋', title: 'Read the rejection reason', body: 'Review the specific reason your application was not approved.' },
      { icon: '✏️', title: 'Correct and resubmit', body: 'Fix the identified issues and submit a new application.' },
      { icon: '💬', title: 'Contact support if unclear', body: 'Our team is happy to clarify what is needed to get approved.' },
    ],
    unverified: [
      { icon: '📝', title: 'Complete registration', body: 'Fill in your company details and upload required documents.' },
    ],
  };

  const list = steps[status];
  if (!list) return null;

  return (
    <div className="mt-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[1px] text-neutral-400">What happens next</p>
      <div className="space-y-3">
        {list.map((s, i) => (
          <div key={i} className="flex gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
              style={{ background: '#f3ede4' }}
              aria-hidden="true"
            >
              {s.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800">{s.title}</p>
              <p className="text-xs leading-relaxed text-neutral-500">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading skeleton
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 rounded-2xl bg-neutral-100" />
      <div className="h-4 w-3/4 rounded bg-neutral-100" />
      <div className="h-4 w-1/2 rounded bg-neutral-100" />
      <div className="h-4 w-2/3 rounded bg-neutral-100" />
    </div>
  );
}

export default function VerifyStatusPage() {
  const router = useRouter();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/accounts/me/verification-status/', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
          // Auto-redirect if approved
          if (json.status === 'verified') {
            setTimeout(() => router.push('/dashboard'), 2500);
          }
        } else if (res.status === 401) {
          router.push('/auth/login');
        } else {
          setLoadError('Unable to load your verification status. Please refresh the page.');
        }
      } catch {
        setLoadError('Unable to connect. Check your internet and try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [router]);

  const cfg = data ? STATUS_CONFIG[data.status] : null;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(circle at 15% 10%, #fbe3c4, transparent 50%), radial-gradient(circle at 85% 20%, #f6d9d3, transparent 50%), #fdf6ee',
      }}
    >
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2" aria-label="FullLoadTrailer home">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
            style={{ background: '#FFCB56', color: '#1A1953' }}
            aria-hidden="true"
          >
            FL
          </span>
          <span className="text-base font-semibold tracking-tight text-neutral-900">
            FullLoad<span style={{ color: '#d97b3f' }}>Trailer</span>
          </span>
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
        >
          Contact support
        </Link>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[520px] px-6 pb-20 pt-6">

        {/* Page badge + title */}
        <div className="mb-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#c2622b]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97b3f]" />
            ACCOUNT VERIFICATION
          </span>
          <h1
            className="mt-3 text-[clamp(22px,4vw,30px)] font-normal leading-tight text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Verification status
          </h1>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm">

          {/* Load error */}
          {loadError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{loadError}</p>
            </div>
          )}

          {loading && !loadError && <Skeleton />}

          {!loading && !loadError && data && cfg && (
            <>
              {/* Status banner */}
              <div
                className={`flex items-start gap-4 rounded-xl border p-5 ${cfg.bannerBg} ${cfg.bannerBorder}`}
                role="status"
                aria-live="polite"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg}`}>
                  {cfg.icon}
                </div>
                <div className="min-w-0">
                  <p className={`text-base font-semibold ${cfg.headingColor}`}>{cfg.heading}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{cfg.subheading}</p>
                  {data.submittedAt && (
                    <p className="mt-2 text-xs text-neutral-400">
                      Submitted: {new Date(data.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              {/* Rejection reason */}
              {data.status === 'rejected' && data.rejectionReason && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-[1px] text-red-500">Rejection reason</p>
                  <p className="text-sm leading-relaxed text-red-800">{data.rejectionReason}</p>
                </div>
              )}

              {/* Info requested */}
              {data.status === 'needs_info' && data.infoRequested && (
                <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-[1px] text-orange-500">Information requested</p>
                  <p className="text-sm leading-relaxed text-orange-800">{data.infoRequested}</p>
                </div>
              )}

              {/* What happens next */}
              <NextSteps status={data.status} />

              {/* Divider */}
              <div className="my-6 h-px bg-[#e8e0d6]" />

              {/* Action buttons */}
              <div className="flex flex-col gap-3">

                {/* Re-upload / resubmit */}
                {(data.status === 'rejected' || data.status === 'needs_info') && (
                  <Link
                    href="/auth/register"
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
                    style={{ background: '#d97b3f' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {data.status === 'rejected' ? 'Correct & resubmit application' : 'Upload requested documents'}
                  </Link>
                )}

                {/* Unverified — go register */}
                {data.status === 'unverified' && (
                  <Link
                    href="/auth/register"
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
                    style={{ background: '#d97b3f' }}
                  >
                    Complete registration →
                  </Link>
                )}

                {/* Basic — go to bulletin board */}
                {data.status === 'basic' && (
                  <Link
                    href="/board"
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
                    style={{ background: '#d97b3f' }}
                  >
                    Go to Bulletin Board →
                  </Link>
                )}

                {/* Contact support — always shown except approved */}
                {data.status !== 'verified' && (
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e0d5c8] bg-white py-3.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#d97b3f] hover:text-[#d97b3f]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contact support
                  </Link>
                )}

                {/* Refresh status */}
                {data.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => { setLoading(true); setData(null); }}
                    className="text-center text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-600"
                  >
                    Refresh status
                  </button>
                )}

              </div>
            </>
          )}
        </div>

        {/* FAQ nudge */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          Questions about the verification process?{' '}
          <Link href="/how-it-works" className="text-[#d97b3f] underline underline-offset-2 hover:text-[#c2622b]">
            Read how it works →
          </Link>
        </p>

      </main>
    </div>
  );
}
