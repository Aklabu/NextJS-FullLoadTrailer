'use client';

import { useState } from 'react';
import Link from 'next/link';
import VerificationBadge from '@/components/VerificationBadge';
import type { BoardPost } from './types';
import { EQUIPMENT_LABELS, POST_TYPE_LABELS } from './types';

// Stub — replace with GET /api/board/posts/:id/
const MOCK_POST: BoardPost = {
  id: '1',
  postType: 'load_available',
  origin: 'Chicago, IL',
  destination: 'Detroit, MI',
  equipmentType: 'moving_trailer',
  cubicFeet: 1200,
  pickupDate: '2026-09-25',
  description: 'Full trailer of household goods. Need a reliable carrier with experience in residential moves. Pickup from a residential address — no loading dock. Standard furniture, boxes, and appliances.',
  postedAt: '2026-09-19T08:30:00Z',
  poster: {
    id: 'p1',
    companyName: 'Acme Freight LLC',
    verificationStatus: 'verified',
  },
};

type ReportState = 'idle' | 'open' | 'submitting' | 'done';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatPostedAt(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

// Report / flag modal
function ReportModal({ onClose, onSubmit, state }: {
  onClose: () => void;
  onSubmit: (reason: string) => void;
  state: ReportState;
}) {
  const [reason, setReason] = useState('');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
      role="dialog" aria-modal="true" aria-label="Report post"
    >
      <div className="w-full max-w-[420px] rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-2xl">
        {state === 'done' ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-800">Report submitted</p>
            <p className="mt-1 text-xs text-neutral-500">Our team will review this post. Thank you.</p>
            <button type="button" onClick={onClose} className="mt-4 rounded-xl border border-[#e0d5c8] px-5 py-2 text-sm font-semibold text-neutral-600 hover:border-[#fc3f07] hover:text-[#fc3f07] transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            <h3
              className="mb-1 text-base font-normal text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Report this post
            </h3>
            <p className="mb-4 text-xs text-neutral-500">Let us know why this post is inappropriate or violates community guidelines.</p>

            <div className="mb-4 space-y-2">
              {['Spam or duplicate', 'Misleading information', 'Contains contact details', 'Inappropriate content', 'Other'].map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e8e0d6] p-3 transition-colors hover:border-[#fc3f07]">
                  <input
                    type="radio" name="report-reason" value={opt}
                    checked={reason === opt}
                    onChange={() => setReason(opt)}
                    className="accent-[#fc3f07]"
                  />
                  <span className="text-sm text-neutral-700">{opt}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-xl border border-[#e0d5c8] py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reason || state === 'submitting'}
                onClick={() => onSubmit(reason)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 hover:enabled:bg-red-600"
                style={{ background: '#ef4444' }}
              >
                {state === 'submitting' ? 'Submitting…' : 'Submit report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const post = MOCK_POST;
  const isLoad = post.postType === 'load_available';

  // Contact disclosure — TBD per business rule, showing as button that reveals message flow
  const [contactRevealed, setContactRevealed] = useState(false);
  const [reportState, setReportState] = useState<ReportState>('idle');

  async function handleReport(reason: string) {
    setReportState('submitting');
    try {
      await fetch(`/api/board/posts/${post.id}/report/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
    } catch {
      // best-effort
    }
    setReportState('done');
  }

  return (
    <div className="mx-auto max-w-[720px] px-6 py-8">

      {/* Back link */}
      <Link
        href="/board"
        className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Board
      </Link>

      <div className="space-y-5">

        {/* Main post card */}
        <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm">

          {/* Post type + timestamp */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[1px]"
              style={{
                background: isLoad ? '#fff0e0' : '#e6f0f2',
                color: isLoad ? '#d93506' : '#224248',
              }}
            >
              {POST_TYPE_LABELS[post.postType]}
            </span>
            <span className="text-xs text-neutral-400">Posted {formatPostedAt(post.postedAt)}</span>
          </div>

          {/* Route headline */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h1
              className="text-2xl font-normal text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {post.origin}
            </h1>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h1
              className="text-2xl font-normal text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {post.destination}
            </h1>
          </div>

          {/* Specs grid */}
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Cubic feet', value: `${post.cubicFeet.toLocaleString()} cu ft`, icon: '📦' },
              { label: 'Equipment', value: EQUIPMENT_LABELS[post.equipmentType], icon: '🚚' },
              { label: 'Pickup date', value: formatDate(post.pickupDate), icon: '📅' },
            ].map((spec) => (
              <div key={spec.label} className="rounded-xl border border-[#f0ece6] bg-[#fafaf8] p-3.5">
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">{spec.label}</p>
                <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-800">
                  <span aria-hidden="true">{spec.icon}</span> {spec.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6 rounded-xl border border-[#f0ece6] bg-[#fafaf8] p-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[1px] text-neutral-400">Description</p>
            <p className="text-sm leading-relaxed text-neutral-700">{post.description}</p>
          </div>

          {/* Contact section */}
          <div id="contact" className="rounded-xl border border-[#e8e0d6] p-5">
            <p className="mb-3 text-sm font-semibold text-neutral-800">Contact the poster</p>
            {!contactRevealed ? (
              <>
                <p className="mb-4 text-xs leading-relaxed text-neutral-500">
                  Send a message through the platform to connect with this poster.
                  Contact details are kept private until both parties agree.{' '}
                  <span className="italic text-neutral-400">(Disclosure policy TBD)</span>
                </p>
                <button
                  type="button"
                  onClick={() => setContactRevealed(true)}
                  className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
                  style={{ background: '#fc3f07' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Poster
                </button>
              </>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Message thread opened</p>
                  <p className="mt-0.5 text-xs text-emerald-700">
                    Your conversation with {post.poster.companyName} has been started.{' '}
                    <Link href="/messages" className="font-semibold underline underline-offset-2 hover:text-emerald-900">
                      Go to Messages →
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Poster profile card */}
        <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[1px] text-neutral-400">Posted by</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ background: '#2b1508' }}
                aria-hidden="true"
              >
                {post.poster.companyName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">{post.poster.companyName}</p>
                <VerificationBadge status={post.poster.verificationStatus} />
              </div>
            </div>
            <Link
              href={`/profiles/${post.poster.id}`}
              className="rounded-xl border border-[#e0d5c8] px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
            >
              View profile →
            </Link>
          </div>
        </div>

        {/* Report */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setReportState('open')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            Flag / Report this post
          </button>
        </div>

      </div>

      {/* Report modal */}
      {(reportState === 'open' || reportState === 'submitting' || reportState === 'done') && (
        <ReportModal
          state={reportState}
          onClose={() => setReportState('idle')}
          onSubmit={handleReport}
        />
      )}

    </div>
  );
}
