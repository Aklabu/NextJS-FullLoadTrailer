'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BID_STATUS_COLORS, LOAD_STATUS_COLORS } from '../types';
import { getMyBids, withdrawBid, type MyBidListItem, type MyBidsTab } from '@/features/marketplace/api/biddingApi';
import { ApiError } from '@/lib/api/client';
import CarrierSubNav from './CarrierSubNav';

type BidTab = MyBidsTab;

const TABS: { key: BidTab; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
  { key: 'withdrawn', label: 'Withdrawn' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-[#e8e0d6] bg-white p-5">
          <div className="mb-3 flex justify-between">
            <div className="h-4 w-40 rounded bg-neutral-100" />
            <div className="h-6 w-20 rounded-full bg-neutral-100" />
          </div>
          <div className="mb-3 h-5 w-56 rounded bg-neutral-100" />
          <div className="flex gap-3">
            <div className="h-14 w-28 rounded-xl bg-neutral-100" />
            <div className="h-14 w-28 rounded-xl bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BidRow({ bid, onWithdraw, withdrawing }: { bid: MyBidListItem; onWithdraw: (id: string, loadId: string) => void; withdrawing: string | null }) {
  const bidCfg = BID_STATUS_COLORS[bid.bid_status] ?? { bg: '#f3f4f6', text: '#6b7280', label: bid.bid_status };
  const loadCfg = LOAD_STATUS_COLORS[bid.load_status as keyof typeof LOAD_STATUS_COLORS] ?? { bg: '#f3f4f6', text: '#6b7280', label: bid.load_status };
  const isWithdrawing = withdrawing === bid.id;

  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm transition-all hover:border-[#fc3f07]">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-mono text-neutral-400">{bid.job_id}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">{bid.origin}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            <span className="text-sm font-semibold text-neutral-900">{bid.destination}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            <span className="text-xs text-neutral-500">{bid.equipment_type}</span>
            <span className="text-xs text-neutral-500">Pickup {formatDate(bid.pickup_date)}</span>
            <span className="text-xs text-neutral-500">Bid placed {formatDate(bid.placed_at)}</span>
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
          <p className="text-lg font-bold text-neutral-900">${Number(bid.bid_amount).toLocaleString()}</p>
        </div>
        {bid.counter_amount && (
          <div className="rounded-xl bg-[#fffbf5] border border-[#f0c896] px-4 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#d93506]">Counter offered</p>
            <p className="text-lg font-bold text-neutral-900">${Number(bid.counter_amount).toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/marketplace/carrier/loads/${bid.load_id}`}
          className="rounded-xl border border-[#e0d5c8] px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
          View load
        </Link>
        {(bid.bid_status === 'pending' || bid.bid_status === 'countered') && (
          <button type="button" onClick={() => onWithdraw(bid.id, bid.load_id)} disabled={isWithdrawing}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60">
            {isWithdrawing ? 'Withdrawing…' : 'Withdraw bid'}
          </button>
        )}
        {bid.bid_status === 'countered' && (
          <Link href={`/marketplace/carrier/loads/${bid.load_id}`}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            style={{ background: '#059669' }}>
            Review counter →
          </Link>
        )}
        {bid.bid_status === 'accepted' && bid.booking_id && (
          <Link href={`/marketplace/booking/${bid.booking_id}`}
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BidTab>('active');
  const [bids, setBids] = useState<MyBidListItem[]>([]);
  const [counts, setCounts] = useState({ active: 0, won: 0, lost: 0, withdrawn: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getMyBids(activeTab);
        setBids(res.data.bids);
        setCounts(res.data.counts);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) { router.push('/auth/login'); return; }
          setError(err.message || 'Failed to load bids.');
        } else {
          setError('Unable to connect. Check your internet and try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeTab, router]);

  async function handleWithdraw(bidId: string, loadId: string) {
    setWithdrawing(bidId);
    try {
      await withdrawBid(loadId);
      setBids((prev) => prev.filter((b) => b.id !== bidId));
      setCounts((prev) => ({ ...prev, active: Math.max(0, prev.active - 1), withdrawn: prev.withdrawn + 1 }));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Unable to withdraw bid. Please try again.';
      setError(msg);
    } finally {
      setWithdrawing(null);
    }
  }

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <CarrierSubNav />
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

      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : bids.length === 0 ? (
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
          {bids.map((b) => <BidRow key={b.id} bid={b} onWithdraw={handleWithdraw} withdrawing={withdrawing} />)}
        </div>
      )}
    </div>
  );
}
