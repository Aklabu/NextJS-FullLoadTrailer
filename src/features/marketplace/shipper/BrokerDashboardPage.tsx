'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MarketplaceLoad, LoadStatus } from '../types';
import { LOAD_STATUS_COLORS } from '../types';

const MOCK_LOADS: MarketplaceLoad[] = [
  {
    id: 'l1', jobId: 'FTL-2026-0042', status: 'bidding', pricingMode: 'open_bidding', visibility: 'public',
    origin: 'Chicago, IL', destination: 'Detroit, MI', pickupDate: '2026-09-25', deliveryDate: '2026-09-26',
    cubicFeet: 1200, equipmentType: 'Dry Van', postedAt: '2026-09-18T10:00:00Z',
    poster: { id: 'me', companyName: 'Acme Broker', role: 'broker', verificationStatus: 'verified' },
    bids: [
      { id: 'b1', carrier: { id: 'c1', companyName: 'FastHaul LLC', role: 'carrier', verificationStatus: 'verified' }, amount: 2400, status: 'pending', placedAt: '2026-09-18T12:00:00Z', updatedAt: '2026-09-18T12:00:00Z' },
    ],
    auditLog: [],
  },
  {
    id: 'l2', jobId: 'FTL-2026-0041', status: 'open', pricingMode: 'fixed', visibility: 'public',
    origin: 'Atlanta, GA', destination: 'Nashville, TN', pickupDate: '2026-09-28', deliveryDate: '2026-09-29',
    cubicFeet: 800, equipmentType: 'Flatbed', fixedPrice: 1800, postedAt: '2026-09-17T09:00:00Z',
    poster: { id: 'me', companyName: 'Acme Broker', role: 'broker', verificationStatus: 'verified' },
    bids: [], auditLog: [],
  },
  {
    id: 'l3', jobId: 'FTL-2026-0039', status: 'open', pricingMode: 'open_bidding', visibility: 'public',
    origin: 'Miami, FL', destination: 'Orlando, FL', pickupDate: '2026-09-27', deliveryDate: '2026-09-27',
    cubicFeet: 600, equipmentType: 'Reefer', postedAt: '2026-09-17T08:00:00Z',
    poster: { id: 'me', companyName: 'Acme Broker', role: 'broker', verificationStatus: 'verified' },
    bids: [], auditLog: [],
  },
  {
    id: 'l4', jobId: 'FTL-2026-0035', status: 'booked', pricingMode: 'best_offer', visibility: 'public',
    origin: 'Dallas, TX', destination: 'Houston, TX', pickupDate: '2026-09-20', deliveryDate: '2026-09-21',
    cubicFeet: 600, equipmentType: 'Box Truck', postedAt: '2026-09-14T08:00:00Z',
    poster: { id: 'me', companyName: 'Acme Broker', role: 'broker', verificationStatus: 'verified' },
    bids: [{ id: 'b2', carrier: { id: 'c2', companyName: 'LoneStar Logistics', role: 'carrier', verificationStatus: 'verified' }, amount: 950, status: 'accepted', placedAt: '2026-09-15T10:00:00Z', updatedAt: '2026-09-15T11:00:00Z' }],
    auditLog: [],
  },
  {
    id: 'l5', jobId: 'FTL-2026-0031', status: 'completed', pricingMode: 'open_bidding', visibility: 'public',
    origin: 'Phoenix, AZ', destination: 'Los Angeles, CA', pickupDate: '2026-09-10', deliveryDate: '2026-09-11',
    cubicFeet: 1400, equipmentType: 'Dry Van', postedAt: '2026-09-05T07:00:00Z',
    poster: { id: 'me', companyName: 'Acme Broker', role: 'broker', verificationStatus: 'verified' },
    bids: [], auditLog: [],
  },
];

type KanbanCol = { key: LoadStatus; label: string; icon: string };

const COLUMNS: KanbanCol[] = [
  { key: 'open', label: 'Needs Carrier', icon: '📋' },
  { key: 'bidding', label: 'Bidding', icon: '⚡' },
  { key: 'booked', label: 'Booked', icon: '✅' },
  { key: 'completed', label: 'Completed', icon: '🏁' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function KanbanCard({ load }: { load: MarketplaceLoad }) {
  const cfg = LOAD_STATUS_COLORS[load.status];
  return (
    <Link href={`/marketplace/loads/${load.id}`}
      className="block rounded-xl border border-[#e8e0d6] bg-white p-4 shadow-sm transition-all hover:border-[#d97b3f] hover:shadow-md">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-mono text-neutral-400">{load.jobId}</p>
        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[1px]" style={{ background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
      </div>
      <p className="mb-1 text-sm font-semibold text-neutral-800 leading-tight">{load.origin} → {load.destination}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        <span className="text-[11px] text-neutral-500">{load.cubicFeet.toLocaleString()} cu ft</span>
        <span className="text-[11px] text-neutral-500">{formatDate(load.pickupDate)}</span>
      </div>
      {load.bids.length > 0 && (
        <div className="mt-2 flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[#d97b3f]" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-[#d97b3f]">{load.bids.length} bid{load.bids.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </Link>
  );
}

export default function BrokerDashboardPage() {
  const [search, setSearch] = useState('');

  const filteredLoads = MOCK_LOADS.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return l.jobId.toLowerCase().includes(q) || l.origin.toLowerCase().includes(q) || l.destination.toLowerCase().includes(q);
  });

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#c2622b]">
            <span className="h-1 w-1 rounded-full bg-[#d97b3f]" aria-hidden="true" />BROKER DASHBOARD
          </span>
          <h1 className="mt-1 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Job Pipeline</h1>
          <p className="mt-1 text-sm text-neutral-500">Overview of all your active and completed loads.</p>
        </div>
        <Link href="/marketplace/post-load"
          className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
          style={{ background: '#d97b3f' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          New Job
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by job number, route…"
            className="w-full rounded-xl border border-[#e0d5c8] bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#d97b3f] focus:ring-2 focus:ring-[#d97b3f]/20" />
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const colLoads = filteredLoads.filter((l) => l.status === col.key);
          const colCfg = LOAD_STATUS_COLORS[col.key];
          return (
            <div key={col.key} className="flex flex-col rounded-2xl border border-[#e8e0d6] bg-[#fafaf8] overflow-hidden">
              {/* Column header */}
              <div className="flex items-center justify-between border-b border-[#e8e0d6] bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{col.icon}</span>
                  <span className="text-sm font-semibold text-neutral-700">{col.label}</span>
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: colCfg.bg, color: colCfg.text }}>
                  {colLoads.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 p-3 flex-1 min-h-[160px]">
                {colLoads.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#e0d5c8] py-8">
                    <p className="text-xs text-neutral-400">No jobs here</p>
                  </div>
                ) : (
                  colLoads.map((l) => <KanbanCard key={l.id} load={l} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
