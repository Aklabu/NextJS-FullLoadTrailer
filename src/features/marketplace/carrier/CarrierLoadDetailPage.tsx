'use client';

import { useState } from 'react';
import Link from 'next/link';
import VerificationBadge from '@/components/VerificationBadge';
import type { Bid } from '../types';
import { LOAD_STATUS_COLORS, BID_STATUS_COLORS, PRICING_MODE_LABELS } from '../types';

// Stub — replace with GET /api/marketplace/loads/:id/carrier-view/
const MOCK_LOAD = {
  id: 'l1', jobId: 'FTL-2026-0042', status: 'bidding' as const,
  pricingMode: 'open_bidding' as const, visibility: 'public' as const,
  origin: 'Chicago, IL', destination: 'Detroit, MI',
  pickupDate: '2026-09-25', deliveryDate: '2026-09-26',
  cubicFeet: 1200, equipmentType: 'Dry Van',
  specialRequirements: 'Liftgate required at pickup.',
  postedAt: '2026-09-18T10:00:00Z',
  poster: { id: 'p1', companyName: 'Acme Freight LLC', role: 'shipper' as const, verificationStatus: 'verified' as const, avgRating: 4.9 },
  bidCount: 3,
};

// Simulate current carrier's existing bid (null if not yet bid)
type BidState = 'none' | 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';

const MOCK_MY_BID: { state: BidState; amount?: number; counterAmount?: number } = {
  state: 'none',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`} role="img">
      {[1,2,3,4,5].map((n) => <svg key={n} className="h-3 w-3" viewBox="0 0 20 20" fill={n <= Math.round(rating) ? '#FFCB56' : '#e8e0d6'} aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
    </div>
  );
}

export default function CarrierLoadDetailPage() {
  const load = MOCK_LOAD;
  const [bidState, setBidState] = useState<BidState>(MOCK_MY_BID.state);
  const [myAmount, setMyAmount] = useState(MOCK_MY_BID.amount ?? 0);
  const [counterAmount] = useState(MOCK_MY_BID.counterAmount);
  const [bidInput, setBidInput] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const statusCfg = LOAD_STATUS_COLORS[load.status];

  async function handlePlaceBid() {
    if (!bidInput || Number(bidInput) <= 0) { setError('Enter a valid bid amount.'); return; }
    setSubmitting(true); setError('');
    try {
      await fetch(`/api/marketplace/loads/${load.id}/bids/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(bidInput), note: bidNote.trim() || null }),
      });
      setMyAmount(Number(bidInput));
      setBidState('pending');
    } catch {
      setError('Unable to submit bid. Please try again.');
    } finally { setSubmitting(false); }
  }

  async function handleWithdraw() {
    setSubmitting(true);
    try {
      await fetch(`/api/marketplace/loads/${load.id}/bids/mine/withdraw/`, { method: 'POST' });
      setBidState('withdrawn');
    } catch {
      setError('Unable to withdraw bid.');
    } finally { setSubmitting(false); }
  }

  async function handleAcceptCounter() {
    setSubmitting(true);
    try {
      await fetch(`/api/marketplace/loads/${load.id}/bids/mine/accept-counter/`, { method: 'POST' });
      setBidState('accepted');
    } catch {
      setError('Unable to accept counter.');
    } finally { setSubmitting(false); }
  }

  return (
    <div className="mx-auto max-w-[860px] px-6 py-8">
      <Link href="/marketplace/carrier/loads" className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        Browse Loads
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

        {/* Left — load info */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-mono text-neutral-400">{load.jobId}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{load.origin}</h1>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  <h1 className="text-2xl font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{load.destination}</h1>
                </div>
              </div>
              <span className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[1px]" style={{ background: statusCfg.bg, color: statusCfg.text }}>{statusCfg.label}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Pickup', value: formatDate(load.pickupDate) },
                { label: 'Delivery', value: formatDate(load.deliveryDate) },
                { label: 'Cubic feet', value: `${load.cubicFeet.toLocaleString()} cu ft` },
                { label: 'Equipment', value: load.equipmentType },
                { label: 'Pricing', value: PRICING_MODE_LABELS[load.pricingMode] },
                { label: 'Active bids', value: `${load.bidCount} bid${load.bidCount !== 1 ? 's' : ''}` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-[#f0ece6] bg-[#fafaf8] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">{s.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-neutral-800">{s.value}</p>
                </div>
              ))}
            </div>

            {load.specialRequirements && (
              <div className="mt-4 rounded-xl border border-[#f0c896] bg-[#fffbf5] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#d93506]">Special requirements</p>
                <p className="mt-1 text-sm text-[#7a4a1a]">{load.specialRequirements}</p>
              </div>
            )}

            <p className="mt-4 text-xs text-neutral-400 italic">
              Full pickup/delivery addresses are shared with the winning carrier after booking.
            </p>
          </div>

          {/* Poster card */}
          <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[1px] text-neutral-400">Posted by</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: '#2b1508' }} aria-hidden="true">
                {load.poster.companyName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/profiles/${load.poster.id}`} className="text-sm font-semibold text-neutral-800 hover:text-[#fc3f07] transition-colors">{load.poster.companyName}</Link>
                  <VerificationBadge status={load.poster.verificationStatus} />
                </div>
                {load.poster.avgRating && (
                  <div className="mt-0.5 flex items-center gap-1">
                    <StarRating rating={load.poster.avgRating} />
                    <span className="text-xs text-neutral-400">{load.poster.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right — bid panel */}
        <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm self-start">
          <h2 className="mb-4 text-base font-semibold text-neutral-800" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {bidState === 'none' ? 'Place your bid' : 'Your bid'}
          </h2>

          {error && <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{error}</p>}

          {/* Not yet bid */}
          {bidState === 'none' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="bidAmount" className="mb-1.5 block text-sm font-medium text-neutral-700">Your bid (USD) <span className="text-red-500">*</span></label>
                <input id="bidAmount" type="number" value={bidInput} onChange={(e) => { setBidInput(e.target.value); setError(''); }} placeholder="e.g. 2200"
                  className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20" />
              </div>
              <div>
                <label htmlFor="bidNote" className="mb-1.5 block text-sm font-medium text-neutral-700">Note <span className="text-neutral-400 text-xs">(optional)</span></label>
                <textarea id="bidNote" value={bidNote} onChange={(e) => setBidNote(e.target.value)} rows={3}
                  placeholder="e.g. Available on time, have liftgate…"
                  className="w-full resize-none rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20" />
              </div>
              <button type="button" onClick={handlePlaceBid} disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 hover:enabled:bg-[#d93506]"
                style={{ background: '#fc3f07' }}>
                {submitting ? <><svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting…</> : 'Submit Bid'}
              </button>
            </div>
          )}

          {/* Pending */}
          {bidState === 'pending' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-amber-600">Bid pending</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900">${myAmount.toLocaleString()}</p>
                <p className="text-xs text-amber-700 mt-1">Waiting for shipper's response.</p>
              </div>
              <button type="button" onClick={handleWithdraw} disabled={submitting}
                className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60">
                Withdraw bid
              </button>
              <Link href={`/messages?job=${load.id}`} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#e0d5c8] py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Message shipper
              </Link>
            </div>
          )}

          {/* Countered */}
          {bidState === 'countered' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#f0c896] bg-[#fffbf5] p-4">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#d93506]">Shipper countered</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900">${counterAmount?.toLocaleString()}</p>
                <p className="text-xs text-[#7a4a1a] mt-1">Your original bid: ${myAmount.toLocaleString()}</p>
              </div>
              <button type="button" onClick={handleAcceptCounter} disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 hover:enabled:bg-emerald-700"
                style={{ background: '#059669' }}>
                {submitting ? 'Accepting…' : 'Accept Counter'}
              </button>
              <button type="button" onClick={handleWithdraw} disabled={submitting}
                className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60">
                Decline &amp; Withdraw
              </button>
            </div>
          )}

          {/* Accepted */}
          {bidState === 'accepted' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm font-semibold text-emerald-800">Bid accepted!</p>
                <p className="text-xs text-emerald-700 mt-0.5">Agreed rate: ${myAmount.toLocaleString()}</p>
              </div>
              <Link href={`/marketplace/booking/${load.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
                style={{ background: '#fc3f07' }}>
                View Booking Confirmation →
              </Link>
            </div>
          )}

          {/* Rejected / Withdrawn */}
          {(bidState === 'rejected' || bidState === 'withdrawn') && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
              <p className="text-sm font-semibold text-neutral-600">{bidState === 'rejected' ? 'Bid rejected' : 'Bid withdrawn'}</p>
              <p className="mt-1 text-xs text-neutral-400">This load is {bidState === 'rejected' ? 'no longer available for rebidding.' : 'still open — you can submit a new bid.'}</p>
              {bidState === 'withdrawn' && (
                <button type="button" onClick={() => setBidState('none')} className="mt-3 text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
                  Place a new bid
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
