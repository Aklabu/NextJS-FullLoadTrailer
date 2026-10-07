'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VerificationBadge from '@/components/VerificationBadge';
import {
  getLoad,
  type LoadCarrierDetail,
} from '@/features/marketplace/api/loadsApi';
import { placeBid, withdrawBid, getMyBid, acceptCounter } from '@/features/marketplace/api/biddingApi';
import { ApiError } from '@/lib/api/client';
import { LOAD_STATUS_COLORS, PRICING_MODE_LABELS } from '../types';
import type { LoadStatus } from '../types';

interface Props {
  id: string;
}

type BidState = 'none' | 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className="h-3 w-3" viewBox="0 0 20 20"
          fill={n <= Math.round(rating) ? '#ff3d03' : '#e8e0d6'} aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-48 rounded-2xl bg-neutral-100" />
      <div className="h-64 rounded-2xl bg-neutral-100" />
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function CarrierLoadDetailPage({ id }: Props) {
  const router = useRouter();

  const [load, setLoad] = useState<LoadCarrierDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Bid state — rehydrated from getMyBid on mount, then managed locally
  const [bidState, setBidState] = useState<BidState>('none');
  const [myAmount, setMyAmount] = useState(0);
  const [counterAmount, setCounterAmount] = useState<number | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bidInput, setBidInput] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [loadRes, bidRes] = await Promise.allSettled([
          getLoad(id),
          getMyBid(id),
        ]);
        if (loadRes.status === 'fulfilled') {
          const detail = loadRes.value.data as LoadCarrierDetail;
          setLoad(detail);
          if (detail.booking_id) setBookingId(detail.booking_id);
        } else {
          const err = loadRes.reason;
          if (err instanceof ApiError) {
            if (err.status === 401) { router.push('/auth/login'); return; }
            setLoadError(err.message || 'Failed to load details.');
          } else {
            setLoadError('Unable to connect. Check your internet and try again.');
          }
        }
        if (bidRes.status === 'fulfilled') {
          const myBid = bidRes.value.data;
          setBidState(myBid.status as BidState);
          setMyAmount(Number(myBid.amount));
          if (myBid.counter_amount) setCounterAmount(Number(myBid.counter_amount));
          if (myBid.booking_id) setBookingId(myBid.booking_id);
        }
        // 404 on bid means no bid yet — leave bidState as 'none'
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function handlePlaceBid() {
    if (!bidInput || Number(bidInput) <= 0) { setBidError('Enter a valid bid amount.'); return; }
    setSubmitting(true); setBidError('');
    try {
      const res = await placeBid(id, { amount: bidInput.trim(), note: bidNote.trim() || undefined });
      setMyAmount(Number(res.data.amount));
      setBidState('pending');
      setBidInput('');
      setBidNote('');
    } catch (err) {
      const msg = err instanceof ApiError
        ? (Array.isArray(err.errors?.amount) ? err.errors.amount[0] : err.message)
        : 'Unable to submit bid. Please try again.';
      setBidError(msg as string);
    } finally { setSubmitting(false); }
  }

  async function handleWithdraw() {
    setSubmitting(true); setBidError('');
    try {
      await withdrawBid(id);
      setBidState('withdrawn');
    } catch {
      setBidError('Unable to withdraw bid. Please try again.');
    } finally { setSubmitting(false); }
  }

  async function handleAcceptCounter() {
    setSubmitting(true); setBidError('');
    try {
      const res = await acceptCounter(id);
      setBookingId(res.data.booking_id);
      setBidState('accepted');
    } catch {
      setBidError('Unable to accept counter. Please try again.');
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="mx-auto max-w-[860px] px-6 py-8"><Skeleton /></div>;

  if (loadError) {
    return (
      <div className="mx-auto max-w-[860px] px-6 py-8">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!load) return null;

  const statusCfg = LOAD_STATUS_COLORS[load.status as LoadStatus]
    ?? { bg: '#f3f4f6', text: '#6b7280', label: load.status };

  return (
    <div className="mx-auto max-w-[860px] px-6 py-8">
      <Link href="/marketplace/carrier/loads"
        className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Browse Loads
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

        {/* Left — load info */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-neutral-400">{load.job_id}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-normal text-neutral-900"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{load.origin}</h1>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <h1 className="text-2xl font-normal text-neutral-900"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{load.destination}</h1>
                </div>
              </div>
              <span className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[1px]"
                style={{ background: statusCfg.bg, color: statusCfg.text }}>{statusCfg.label}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Pickup', value: formatDate(load.pickup_date) },
                { label: 'Delivery', value: formatDate(load.delivery_date) },
                { label: 'Cubic feet', value: `${load.cubic_feet.toLocaleString()} cu ft` },
                { label: 'Equipment', value: load.equipment_type },
                { label: 'Pricing', value: PRICING_MODE_LABELS[load.pricing_mode] },
                { label: 'Active bids', value: `${load.bid_count} bid${load.bid_count !== 1 ? 's' : ''}` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-[#f0ece6] bg-[#fafaf8] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">{s.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-neutral-800">{s.value}</p>
                </div>
              ))}
            </div>

            {load.special_requirements && (
              <div className="mt-4 rounded-xl border border-[#f0c896] bg-[#fffbf5] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#d93506]">Special requirements</p>
                <p className="mt-1 text-sm text-[#7a4a1a]">{load.special_requirements}</p>
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ background: '#2b1508' }} aria-hidden="true">
                {load.poster.company_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/profiles/${load.poster.id}`}
                    className="text-sm font-semibold text-neutral-800 hover:text-[#fc3f07] transition-colors">
                    {load.poster.company_name}
                  </Link>
                  <VerificationBadge status={load.poster.verification_status as never} />
                </div>
                {load.poster.avg_rating != null && (
                  <div className="mt-0.5 flex items-center gap-1">
                    <StarRating rating={load.poster.avg_rating} />
                    <span className="text-xs text-neutral-400">{load.poster.avg_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right — bid panel */}
        <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm self-start">
          <h2 className="mb-4 text-base font-semibold text-neutral-800"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {bidState === 'none' ? 'Place your bid' : 'Your bid'}
          </h2>

          {bidError && (
            <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
              {bidError}
            </p>
          )}

          {/* None — bid form */}
          {bidState === 'none' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="bidAmount" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Your bid (USD) <span className="text-red-500">*</span>
                </label>
                <input id="bidAmount" type="number" value={bidInput}
                  onChange={(e) => { setBidInput(e.target.value); setBidError(''); }}
                  placeholder="e.g. 2200"
                  className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20" />
              </div>
              <div>
                <label htmlFor="bidNote" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Note <span className="text-xs font-normal text-neutral-400">(optional)</span>
                </label>
                <textarea id="bidNote" value={bidNote} onChange={(e) => setBidNote(e.target.value)} rows={3}
                  placeholder="e.g. Available on time, have liftgate…"
                  className="w-full resize-none rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20" />
              </div>
              <button type="button" onClick={handlePlaceBid} disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 hover:enabled:bg-[#d93506]"
                style={{ background: '#fc3f07' }}>
                {submitting ? <><Spinner />Submitting…</> : 'Submit Bid'}
              </button>
            </div>
          )}

          {/* Pending */}
          {bidState === 'pending' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-amber-600">Bid pending</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900">${myAmount.toLocaleString()}</p>
                <p className="mt-1 text-xs text-amber-700">Waiting for shipper&apos;s response.</p>
              </div>
              <button type="button" onClick={handleWithdraw} disabled={submitting}
                className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60">
                {submitting ? 'Withdrawing…' : 'Withdraw bid'}
              </button>
              <Link href={`/messages?job=${load.id}`}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#e0d5c8] py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
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
                <p className="mt-1 text-xs text-[#7a4a1a]">Your original bid: ${myAmount.toLocaleString()}</p>
              </div>
              <button type="button" onClick={handleAcceptCounter} disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 hover:enabled:bg-emerald-700"
                style={{ background: '#059669' }}>
                {submitting ? <><Spinner />Accepting…</> : 'Accept Counter'}
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
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-emerald-800">Bid accepted!</p>
                <p className="mt-0.5 text-xs text-emerald-700">Agreed rate: ${myAmount.toLocaleString()}</p>
              </div>
              <Link href={bookingId ? `/marketplace/booking/${bookingId}` : `/marketplace/carrier/loads/${load.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
                style={{ background: '#fc3f07' }}>
                View Booking Confirmation →
              </Link>
            </div>
          )}

          {/* Rejected / Withdrawn */}
          {(bidState === 'rejected' || bidState === 'withdrawn') && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
              <p className="text-sm font-semibold text-neutral-600">
                {bidState === 'rejected' ? 'Bid rejected' : 'Bid withdrawn'}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {bidState === 'rejected'
                  ? 'This load is no longer available for rebidding.'
                  : 'This load is still open — you can submit a new bid.'}
              </p>
              {bidState === 'withdrawn' && (
                <button type="button" onClick={() => { setBidState('none'); setBidError(''); }}
                  className="mt-3 text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
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
