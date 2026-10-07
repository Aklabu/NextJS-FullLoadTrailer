'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VerificationBadge from '@/components/VerificationBadge';
import { LOAD_STATUS_COLORS, PRICING_MODE_LABELS } from '../types';
import { EQUIPMENT_OPTIONS } from '@/lib/equipmentOptions';
import { browseLoads, type BrowseLoadItem } from '@/features/marketplace/api/biddingApi';
import { ApiError } from '@/lib/api/client';
import CarrierSubNav from './CarrierSubNav';

interface Filters {
  origin: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  minCuft: string;
  maxCuft: string;
  equipmentType: string;
}

const EMPTY_FILTERS: Filters = { origin: '', destination: '', dateFrom: '', dateTo: '', minCuft: '', maxCuft: '', equipmentType: 'Any equipment' };

type SortKey = 'newest' | 'pickup_asc' | 'cuft_desc';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function FilterBar({ filters, onChange, onReset }: { filters: Filters; onChange: (k: keyof Filters, v: string) => void; onReset: () => void }) {
  const hasActive = Object.entries(filters).some(([k, v]) => k === 'equipmentType' ? v !== 'Any equipment' : v !== '');
  const inputCls = 'w-full rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20';

  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div><label className="mb-1 block text-xs font-medium text-neutral-500">Origin</label>
          <input type="text" value={filters.origin} onChange={(e) => onChange('origin', e.target.value)} placeholder="e.g. Chicago, IL" className={inputCls} /></div>
        <div><label className="mb-1 block text-xs font-medium text-neutral-500">Destination</label>
          <input type="text" value={filters.destination} onChange={(e) => onChange('destination', e.target.value)} placeholder="e.g. Detroit, MI" className={inputCls} /></div>
        <div><label className="mb-1 block text-xs font-medium text-neutral-500">Equipment</label>
          <select value={filters.equipmentType} onChange={(e) => onChange('equipmentType', e.target.value)} className={`${inputCls} appearance-none`}>
            {EQUIPMENT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select></div>
        <div><label className="mb-1 block text-xs font-medium text-neutral-500">Pickup from</label>
          <input type="date" value={filters.dateFrom} onChange={(e) => onChange('dateFrom', e.target.value)} className={inputCls} /></div>
        <div><label className="mb-1 block text-xs font-medium text-neutral-500">Pickup to</label>
          <input type="date" value={filters.dateTo} onChange={(e) => onChange('dateTo', e.target.value)} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className="mb-1 block text-xs font-medium text-neutral-500">Min cu ft</label>
            <input type="number" value={filters.minCuft} onChange={(e) => onChange('minCuft', e.target.value)} placeholder="0" className={inputCls} /></div>
          <div><label className="mb-1 block text-xs font-medium text-neutral-500">Max cu ft</label>
            <input type="number" value={filters.maxCuft} onChange={(e) => onChange('maxCuft', e.target.value)} placeholder="Any" className={inputCls} /></div>
        </div>
      </div>
      {hasActive && (
        <div className="mt-3 flex justify-end">
          <button type="button" onClick={onReset} className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-[#fc3f07] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function LoadCard({ load }: { load: BrowseLoadItem }) {
  const cfg = LOAD_STATUS_COLORS[load.status];
  const isEligible = load.status === 'open' || load.status === 'bidding';
  return (
    <div className="group rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm transition-all hover:border-[#fc3f07] hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">{load.job_id}</span>
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[1px]" style={{ background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
          {isEligible && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[1px] text-emerald-700">Eligible</span>
          )}
        </div>
        <span className="shrink-0 text-[11px] text-neutral-400">{timeAgo(load.posted_at)}</span>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-neutral-900">{load.origin}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        <span className="text-sm font-semibold text-neutral-900">{load.destination}</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-xs text-neutral-500">{load.cubic_feet.toLocaleString()} cu ft</span>
        <span className="text-xs text-neutral-500">{load.equipment_type}</span>
        <span className="text-xs text-neutral-500">Pickup {formatDate(load.pickup_date)}</span>
        <span className="text-xs text-neutral-500">{PRICING_MODE_LABELS[load.pricing_mode]}</span>
        {load.fixed_price != null && <span className="text-xs font-semibold text-neutral-700">${Number(load.fixed_price).toLocaleString()}</span>}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Link href={`/profiles/${load.poster.id}`} className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: '#2b1508' }} aria-hidden="true">{load.poster.company_name.slice(0, 2).toUpperCase()}</div>
          <span className="text-xs text-neutral-500 hover:text-[#fc3f07] transition-colors">{load.poster.company_name}</span>
          <VerificationBadge status={load.poster.verification_status as never} />
        </Link>
        {load.bid_count > 0 && <span className="ml-auto text-[11px] text-neutral-400">{load.bid_count} bid{load.bid_count !== 1 ? 's' : ''}</span>}
      </div>

      <Link href={`/marketplace/carrier/loads/${load.id}`}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
        style={{ background: isEligible ? '#fc3f07' : '#a8a29e' }}>
        {isEligible ? 'View & Bid →' : 'View Details →'}
      </Link>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e8e0d6] bg-white p-5">
      <div className="mb-3 flex justify-between"><div className="h-4 w-32 rounded bg-neutral-100" /><div className="h-4 w-12 rounded bg-neutral-100" /></div>
      <div className="mb-2 h-5 w-48 rounded bg-neutral-100" />
      <div className="mb-3 flex gap-3"><div className="h-4 w-20 rounded bg-neutral-100" /><div className="h-4 w-24 rounded bg-neutral-100" /></div>
      <div className="h-9 rounded-xl bg-neutral-100" />
    </div>
  );
}

export default function BrowseLoadsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loads, setLoads] = useState<BrowseLoadItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchLoads = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await browseLoads({
        origin: filters.origin || undefined,
        destination: filters.destination || undefined,
        equipment_type: filters.equipmentType !== 'Any equipment' ? filters.equipmentType : undefined,
        pickup_from: filters.dateFrom || undefined,
        pickup_to: filters.dateTo || undefined,
        min_cubic_feet: filters.minCuft ? Number(filters.minCuft) : undefined,
        max_cubic_feet: filters.maxCuft ? Number(filters.maxCuft) : undefined,
        sort,
        page: currentPage,
      });
      setLoads(res.data.results);
      setTotalCount(res.data.count);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) { router.push('/auth/login'); return; }
        if (err.status === 403) { setError('Only verified carriers can access this page.'); }
        else { setError(err.message || 'Failed to load loads.'); }
      } else {
        setError('Could not reach the server. Make sure the backend is running and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, sort, router]);

  useEffect(() => {
    setPage(1);
    fetchLoads(1);
  }, [fetchLoads]);

  function handleChange(k: keyof Filters, v: string) { setFilters((p) => ({ ...p, [k]: v })); }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
  }

  function handlePageChange(n: number) {
    setPage(n);
    fetchLoads(n);
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8">
      <CarrierSubNav />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />CARRIER · MARKETPLACE
          </span>
          <h1 className="mt-1 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Browse Loads</h1>
          <p className="mt-1 text-sm text-neutral-500">Find verified loads matching your route and equipment.</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs text-neutral-500">Sort:</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-[#e0d5c8] bg-white px-3.5 py-2 text-sm text-neutral-700 outline-none focus:border-[#fc3f07] appearance-none">
            <option value="newest">Newest first</option>
            <option value="pickup_asc">Pickup date ↑</option>
            <option value="cuft_desc">Largest load first</option>
          </select>
        </div>
      </div>

      <div className="mb-6"><FilterBar filters={filters} onChange={handleChange} onReset={handleReset} /></div>

      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <p className="mb-4 text-sm text-neutral-500">
          {totalCount === 0 ? 'No loads found' : `${totalCount} load${totalCount !== 1 ? 's' : ''} available`}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : loads.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">🔍</div>
          <p className="text-base font-medium text-neutral-700">No loads match your filters</p>
          <p className="mt-1 text-sm text-neutral-400">Try adjusting your route or dates.</p>
          <button type="button" onClick={handleReset}
            className="mt-5 rounded-xl border border-[#e0d5c8] px-5 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loads.map((l) => <LoadCard key={l.id} load={l} />)}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button type="button" onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0d5c8] text-sm text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07] disabled:opacity-40" aria-label="Previous page">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => handlePageChange(n)} aria-current={n === page ? 'page' : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-medium transition-colors"
              style={{ borderColor: n === page ? '#fc3f07' : '#e0d5c8', background: n === page ? '#fc3f07' : '#fff', color: n === page ? '#fff' : '#525252' }}>{n}</button>
          ))}
          <button type="button" onClick={() => handlePageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0d5c8] text-sm text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07] disabled:opacity-40" aria-label="Next page">›</button>
        </div>
      )}
    </div>
  );
}
