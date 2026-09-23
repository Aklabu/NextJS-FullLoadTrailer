'use client';

import { useState } from 'react';
import Link from 'next/link';
import VerificationBadge from '@/components/VerificationBadge';
import type { MarketplaceLoad, Bid } from '../types';
import { LOAD_STATUS_COLORS, BID_STATUS_COLORS, PRICING_MODE_LABELS } from '../types';

// Stub — replace with GET /api/marketplace/loads/:id/
const MOCK_LOAD: MarketplaceLoad = {
  id: 'l1', jobId: 'FTL-2026-0042', status: 'bidding',
  pricingMode: 'open_bidding', visibility: 'public',
  origin: 'Chicago, IL', destination: 'Detroit, MI',
  pickupDate: '2026-09-25', deliveryDate: '2026-09-26',
  cubicFeet: 1200, equipmentType: 'Dry Van',
  specialRequirements: 'Liftgate required at pickup. Fragile electronics — careful handling.',
  postedAt: '2026-09-18T10:00:00Z',
  poster: { id: 'me', companyName: 'Acme Freight', role: 'shipper', verificationStatus: 'verified' },
  bids: [
    { id: 'b1', carrier: { id: 'c1', companyName: 'FastHaul LLC', role: 'carrier', verificationStatus: 'verified', avgRating: 4.8 }, amount: 2400, status: 'pending', placedAt: '2026-09-18T12:00:00Z', updatedAt: '2026-09-18T12:00:00Z', note: 'Available on the requested date. Own liftgate.' },
    { id: 'b2', carrier: { id: 'c2', companyName: 'RoadLine Co', role: 'carrier', verificationStatus: 'verified', avgRating: 4.5 }, amount: 2250, status: 'pending', placedAt: '2026-09-18T14:00:00Z', updatedAt: '2026-09-18T14:00:00Z' },
    { id: 'b3', carrier: { id: 'c3', companyName: 'SkyRoute Carriers', role: 'carrier', verificationStatus: 'basic', avgRating: 4.2 }, amount: 2100, status: 'countered', counterAmount: 2200, placedAt: '2026-09-18T15:30:00Z', updatedAt: '2026-09-18T16:00:00Z' },
  ],
  auditLog: [
    { id: 'a1', timestamp: '2026-09-18T10:00:00Z', actor: 'Acme Freight', action: 'Load posted' },
    { id: 'a2', timestamp: '2026-09-18T12:00:00Z', actor: 'FastHaul LLC', action: 'Bid placed — $2,400' },
    { id: 'a3', timestamp: '2026-09-18T14:00:00Z', actor: 'RoadLine Co', action: 'Bid placed — $2,250' },
    { id: 'a4', timestamp: '2026-09-18T15:30:00Z', actor: 'SkyRoute Carriers', action: 'Bid placed — $2,100' },
    { id: 'a5', timestamp: '2026-09-18T16:00:00Z', actor: 'Acme Freight', action: 'Counteroffer sent to SkyRoute — $2,200' },
  ],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`} role="img">
      {[1,2,3,4,5].map((n) => (
        <svg key={n} className="h-3 w-3" viewBox="0 0 20 20" fill={n <= Math.round(rating) ? '#ff3d03' : '#e8e0d6'} aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function BidRow({ bid, onAction }: { bid: Bid; onAction: (bidId: string, action: 'accept' | 'reject' | 'counter', amount?: number) => void }) {
  const [counterVal, setCounterVal] = useState('');
  const [showCounter, setShowCounter] = useState(false);
  const cfg = BID_STATUS_COLORS[bid.status];
  const isLocked = bid.status === 'accepted' || bid.status === 'rejected' || bid.status === 'withdrawn';

  return (
    <div className={`rounded-xl border p-4 transition-all ${bid.status === 'accepted' ? 'border-emerald-200 bg-emerald-50' : 'border-[#e8e0d6] bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        {/* Carrier info */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white" style={{ background: '#2b1508' }} aria-hidden="true">
            {bid.carrier.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/profiles/${bid.carrier.id}`} className="text-sm font-semibold text-neutral-800 hover:text-[#fc3f07] transition-colors">
                {bid.carrier.companyName}
              </Link>
              <VerificationBadge status={bid.carrier.verificationStatus} />
            </div>
            {bid.carrier.avgRating && (
              <div className="mt-0.5 flex items-center gap-1">
                <StarRating rating={bid.carrier.avgRating} />
                <span className="text-xs text-neutral-400">{bid.carrier.avgRating.toFixed(1)}</span>
              </div>
            )}
            {bid.note && <p className="mt-1 text-xs text-neutral-500 italic">"{bid.note}"</p>}
            <p className="mt-0.5 text-[11px] text-neutral-400">{formatTs(bid.placedAt)}</p>
          </div>
        </div>

        {/* Amount + status */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="text-lg font-bold text-neutral-900">${bid.amount.toLocaleString()}</span>
          {bid.counterAmount && bid.status === 'countered' && (
            <span className="text-xs text-amber-700">Counter: ${bid.counterAmount.toLocaleString()}</span>
          )}
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[1px]" style={{ background: cfg.bg, color: cfg.text }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Actions */}
      {!isLocked && MOCK_LOAD.status !== 'booked' && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => onAction(bid.id, 'accept')}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
            style={{ background: '#059669' }}>
            Accept
          </button>
          {!showCounter ? (
            <button type="button" onClick={() => setShowCounter(true)}
              className="rounded-xl border border-[#e0d5c8] px-4 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
              Counter
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input type="number" value={counterVal} onChange={(e) => setCounterVal(e.target.value)}
                placeholder="Your counter ($)" className="w-36 rounded-xl border border-[#e0d5c8] px-3 py-2 text-xs outline-none focus:border-[#fc3f07]" />
              <button type="button" onClick={() => { onAction(bid.id, 'counter', Number(counterVal)); setShowCounter(false); setCounterVal(''); }}
                disabled={!counterVal || Number(counterVal) <= 0}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:enabled:bg-[#d93506]"
                style={{ background: '#fc3f07' }}>Send</button>
              <button type="button" onClick={() => { setShowCounter(false); setCounterVal(''); }}
                className="text-xs text-neutral-400 hover:text-neutral-600">Cancel</button>
            </div>
          )}
          <button type="button" onClick={() => onAction(bid.id, 'reject')}
            className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50">
            Reject
          </button>
          <Link href={`/messages?job=${MOCK_LOAD.id}&carrier=${bid.carrier.id}`}
            className="ml-auto flex items-center gap-1 rounded-xl border border-[#e0d5c8] px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Message
          </Link>
        </div>
      )}
    </div>
  );
}

export default function LoadDetailPage() {
  const [load, setLoad] = useState<MarketplaceLoad>(MOCK_LOAD);
  const statusCfg = LOAD_STATUS_COLORS[load.status];

  function handleBidAction(bidId: string, action: 'accept' | 'reject' | 'counter', amount?: number) {
    setLoad((prev) => {
      const updatedBids = prev.bids.map((b) => {
        if (b.id !== bidId) {
          if (action === 'accept') return { ...b, status: 'rejected' as const };
          return b;
        }
        if (action === 'accept') return { ...b, status: 'accepted' as const };
        if (action === 'reject') return { ...b, status: 'rejected' as const };
        if (action === 'counter' && amount) return { ...b, status: 'countered' as const, counterAmount: amount };
        return b;
      });
      const newStatus = action === 'accept' ? 'booked' : prev.status;
      const accepted = action === 'accept' ? updatedBids.find((b) => b.id === bidId) : prev.acceptedBid;
      return { ...prev, bids: updatedBids, status: newStatus, acceptedBid: accepted };
    });
  }

  return (
    <div className="mx-auto max-w-[860px] px-6 py-8">
      <Link href="/marketplace/my-loads" className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        My Posted Loads
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">

        {/* Left — load info + bids */}
        <div className="space-y-5">

          {/* Load card */}
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
                { label: 'Visibility', value: load.visibility === 'public' ? 'Public' : 'Private' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-[#f0ece6] bg-[#fafaf8] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">{s.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-neutral-800">{s.value}</p>
                </div>
              ))}
            </div>

            {load.specialRequirements && (
              <div className="mt-4 rounded-xl border border-[#f0ece6] bg-[#fafaf8] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">Special requirements</p>
                <p className="mt-1 text-sm text-neutral-700">{load.specialRequirements}</p>
              </div>
            )}
          </div>

          {/* Bids section */}
          <div className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-neutral-800" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Bids ({load.bids.length})
              </h2>
              {load.status === 'booked' && (
                <Link href={`/marketplace/booking/${load.id}`}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
                  style={{ background: '#fc3f07' }}>
                  View booking →
                </Link>
              )}
            </div>

            {load.bids.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#e0d5c8] py-10 text-center">
                <p className="text-sm text-neutral-400">No bids yet. Carriers will see this load and submit bids.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {load.bids.map((b) => <BidRow key={b.id} bid={b} onAction={handleBidAction} />)}
              </div>
            )}
          </div>
        </div>

        {/* Right — audit log */}
        <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm self-start">
          <h2 className="mb-4 text-sm font-semibold text-neutral-800" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Activity log</h2>
          <ol className="relative border-l border-[#e8e0d6] pl-4 space-y-4">
            {load.auditLog.map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[18px] flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-[#fc3f07]" aria-hidden="true" />
                <p className="text-xs font-medium text-neutral-700">{e.action}</p>
                <p className="text-[10px] text-neutral-400">{e.actor} · {formatTs(e.timestamp)}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}
