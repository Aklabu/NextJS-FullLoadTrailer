'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BID_STATUS_COLORS, LOAD_STATUS_COLORS } from '../types';

type BidTab = 'active' | 'won' | 'lost' | 'withdrawn';

interface BidSummary {
  id: string;
  loadId: string;
  jobId: string;
  origin: string;
  destination: string;
  pickupDate: string;
  equipmentType: string;
  bidAmount: number;
  counterAmount?: number;
  bidStatus: 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';
  loadStatus: 'open' | 'bidding' | 'booked' | 'completed' | 'expired';
  placedAt: string;
}

const MOCK_BIDS: BidSummary[] = [
  { id: 'b1', loadId: 'l1', jobId: 'FTL-2026-0042', origin: 'Chicago, IL', destination: 'Detroit, MI', pickupDate: '2026-09-25', equipmentType: 'Dry Van (Side Door)', bidAmount: 2400, bidStatus: 'pending', loadStatus: 'bidding', placedAt: '2026-09-18T12:00:00Z' },
  { id: 'b2', loadId: 'l3', jobId: 'FTL-2026-0040', origin: 'Dallas, TX', destination: 'Houston, TX', pickupDate: '2026-09-24', equipmentType: 'Box Truck', bidAmount: 850, counterAmount: 920, bidStatus: 'countered', loadStatus: 'bidding', placedAt: '2026-09-17T10:00:00Z' },
  { id: 'b3', loadId: 'l5', jobId: 'FTL-2026-0031', origin: 'Phoenix, AZ', destination: 'Los Angeles, CA', pickupDate: '2026-09-10', equipmentType: 'Moving Trailer', bidAmount: 3200, bidStatus: 'accepted', loadStatus: 'booked', placedAt: '2026-09-06T09:00:00Z' },
  { id: 'b4', loadId: 'l6', jobId: 'FTL-2026-0028', origin: 'Seattle, WA', destination: 'Portland, OR', pickupDate: '2026-09-05', equipmentType: 'Box Truck', bidAmount: 550, bidStatus: 'rejected', loadStatus: 'booked', placedAt: '2026-09-03T08:00:00Z' },
  { id: 'b5', loadId: 'l7', jobId: 'FTL-2026-0025', origin: 'Miami, FL', destination: 'Tampa, FL', pickupDate: '2026-09-01', equipmentType: 'Moving Trailer', bidAmount: 700, bidStatus: 'withdrawn', loadStatus: 'booked', placedAt: '2026-08-30T07:00:00Z' },
];

const TABS: { key: BidTab; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
  { key: 'withdrawn', label: 'Withdrawn' },
];

function bidMatchesTab(bid: BidSummary, tab: BidTab): boolean {
  if (tab === 'active') return bid.bidStatus === 'pending' || bid.bidStatus === 'countered';
  if (tab === 'won') return bid.bidStatus === 'accepted';
  if (tab === 'lost') return bid.bidStatus === 'rejected';
  if (tab === 'withdrawn') return bid.bidStatus === 'withdrawn';
  return false;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function BidRow({ bid, onWithdraw }: { bid: BidSummary; onWithdraw: (id: string) => void }) {
  const bidCfg = BID_STATUS_COLORS[bid.bidStatus];
  const loadCfg = LOAD_STATUS_COLORS[bid.loadStatus];

  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm transition-all hover:border-[#fc3f07]">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-mono text-neutral-400">{bid.jobId}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">{bid.origin}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            <span className="text-sm font-semibold text-neutral-900">{bid.destination}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            <span className="text-xs text-neutral-500">{bid.equipmentType}</span>
            <span className="text-xs text-neutral-500">Pickup {formatDate(bid.pickupDate)}</span>
            <span className="text-xs text-neutral-500">Bid placed {formatDate(bid.placedAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]" style={{ background: bidCfg.bg, color: bidCfg.text }}>{bidCfg.label}</span>
          <span className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[1px]" style={{ background: loadCfg.bg, color: loadCfg.text }}>Load: {loadCfg.label}</span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-[#fafaf8] border border-[#f0ece6] px-4 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">Your bid</p>
          <p className="text-lg font-bold text-neutral-900">${bid.bidAmount.toLocaleString()}</p>
        </div>
        {bid.counterAmount && (
          <div className="rounded-xl bg-[#fffbf5] border border-[#f0c896] px-4 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#d93506]">Counter offered</p>
            <p className="text-lg font-bold text-neutral-900">${bid.counterAmount.toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/marketplace/carrier/loads/${bid.loadId}`}
          className="rounded-xl border border-[#e0d5c8] px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
          View load
        </Link>
        {(bid.bidStatus === 'pending' || bid.bidStatus === 'countered') && (
          <button type="button" onClick={() => onWithdraw(bid.id)}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50">
            Withdraw bid
          </button>
        )}
        {bid.bidStatus === 'countered' && (
          <Link href={`/marketplace/carrier/loads/${bid.loadId}`}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            style={{ background: '#059669' }}>
            Review counter →
          </Link>
        )}
        {bid.bidStatus === 'accepted' && (
          <Link href={`/marketplace/booking/${bid.loadId}`}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
            style={{ background: '#fc3f07' }}>
            View booking →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MyBidsPage() {
  const [activeTab, setActiveTab] = useState<BidTab>('active');
  const [bids, setBids] = useState<BidSummary[]>(MOCK_BIDS);

  function handleWithdraw(id: string) {
    setBids((prev) => prev.map((b) => b.id === id ? { ...b, bidStatus: 'withdrawn' as const } : b));
  }

  const tabBids = bids.filter((b) => bidMatchesTab(b, activeTab));
  const counts = TABS.reduce<Record<BidTab, number>>((acc, t) => {
    acc[t.key] = bids.filter((b) => bidMatchesTab(b, t.key)).length;
    return acc;
  }, { active: 0, won: 0, lost: 0, withdrawn: 0 });

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <div className="mb-6">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
          <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />CARRIER · MARKETPLACE
        </span>
        <h1 className="mt-1 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>My Bids</h1>
        <p className="mt-1 text-sm text-neutral-500">Track all your bidding activity across loads.</p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
            style={{ borderColor: activeTab === t.key ? '#fc3f07' : '#e8e0d6', background: activeTab === t.key ? '#fff8f2' : '#fff', color: activeTab === t.key ? '#d93506' : '#737373' }}>
            {t.label}
            {counts[t.key] > 0 && (
              <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ background: activeTab === t.key ? '#fc3f07' : '#f3ede4', color: activeTab === t.key ? '#fff' : '#7a7168' }}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {tabBids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">
            {activeTab === 'active' ? '⚡' : activeTab === 'won' ? '🏆' : activeTab === 'lost' ? '📉' : '↩️'}
          </div>
          <p className="text-base font-medium text-neutral-700">No {activeTab} bids</p>
          {activeTab === 'active' && (
            <Link href="/marketplace/carrier/loads" className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]" style={{ background: '#fc3f07' }}>
              Browse loads →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tabBids.map((b) => <BidRow key={b.id} bid={b} onWithdraw={handleWithdraw} />)}
        </div>
      )}
    </div>
  );
}
