'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MarketplaceLoad, LoadStatus } from '../types';
import { LOAD_STATUS_COLORS, PRICING_MODE_LABELS } from '../types';

const MOCK_LOADS: MarketplaceLoad[] = [
  {
    id: 'l1', jobId: 'FTL-2026-0042', status: 'bidding', pricingMode: 'open_bidding', visibility: 'public',
    origin: 'Chicago, IL', destination: 'Detroit, MI', pickupDate: '2026-09-25', deliveryDate: '2026-09-26',
    cubicFeet: 1200, equipmentType: 'Dry Van (Side Door)', postedAt: '2026-09-18T10:00:00Z',
    poster: { id: 'me', companyName: 'Acme Freight', role: 'shipper', verificationStatus: 'verified' },
    bids: [
      { id: 'b1', carrier: { id: 'c1', companyName: 'FastHaul LLC', role: 'carrier', verificationStatus: 'verified', avgRating: 4.8 }, amount: 2400, status: 'pending', placedAt: '2026-09-18T12:00:00Z', updatedAt: '2026-09-18T12:00:00Z' },
      { id: 'b2', carrier: { id: 'c2', companyName: 'RoadLine Co', role: 'carrier', verificationStatus: 'verified', avgRating: 4.5 }, amount: 2250, status: 'pending', placedAt: '2026-09-18T14:00:00Z', updatedAt: '2026-09-18T14:00:00Z' },
    ],
    auditLog: [],
  },
  {
    id: 'l2', jobId: 'FTL-2026-0039', status: 'open', pricingMode: 'fixed', visibility: 'public',
    origin: 'Atlanta, GA', destination: 'Nashville, TN', pickupDate: '2026-09-28', deliveryDate: '2026-09-29',
    cubicFeet: 800, equipmentType: 'Box Truck', fixedPrice: 1800, postedAt: '2026-09-17T09:00:00Z',
    poster: { id: 'me', companyName: 'Acme Freight', role: 'shipper', verificationStatus: 'verified' },
    bids: [], auditLog: [],
  },
  {
    id: 'l3', jobId: 'FTL-2026-0031', status: 'booked', pricingMode: 'best_offer', visibility: 'public',
    origin: 'Dallas, TX', destination: 'Houston, TX', pickupDate: '2026-09-20', deliveryDate: '2026-09-21',
    cubicFeet: 600, equipmentType: 'Box Truck', postedAt: '2026-09-14T08:00:00Z',
    poster: { id: 'me', companyName: 'Acme Freight', role: 'shipper', verificationStatus: 'verified' },
    bids: [
      { id: 'b3', carrier: { id: 'c3', companyName: 'LoneStar Logistics', role: 'carrier', verificationStatus: 'verified', avgRating: 4.9 }, amount: 950, status: 'accepted', placedAt: '2026-09-15T10:00:00Z', updatedAt: '2026-09-15T11:00:00Z' },
    ],
    auditLog: [],
  },
  {
    id: 'l4', jobId: 'FTL-2026-0028', status: 'completed', pricingMode: 'open_bidding', visibility: 'public',
    origin: 'Phoenix, AZ', destination: 'Los Angeles, CA', pickupDate: '2026-09-10', deliveryDate: '2026-09-11',
    cubicFeet: 1400, equipmentType: 'Moving Trailer', postedAt: '2026-09-05T07:00:00Z',
    poster: { id: 'me', companyName: 'Acme Freight', role: 'shipper', verificationStatus: 'verified' },
    bids: [], auditLog: [],
  },
];

const STATUS_TABS: { key: LoadStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'bidding', label: 'Bidding' },
  { key: 'booked', label: 'Booked' },
  { key: 'completed', label: 'Completed' },
  { key: 'expired', label: 'Expired' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function StatusPill({ status }: { status: LoadStatus }) {
  const cfg = LOAD_STATUS_COLORS[status];
  return (
    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]"
      style={{ background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
  );
}

function LoadCard({ load }: { load: MarketplaceLoad }) {
  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm transition-all hover:border-[#fc3f07] hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-mono text-neutral-400">{load.jobId}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">{load.origin}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            <span className="text-sm font-semibold text-neutral-900">{load.destination}</span>
          </div>
        </div>
        <StatusPill status={load.status} />
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-xs text-neutral-500">{load.cubicFeet.toLocaleString()} cu ft</span>
        <span className="text-xs text-neutral-500">{load.equipmentType}</span>
        <span className="text-xs text-neutral-500">Pickup {formatDate(load.pickupDate)}</span>
        <span className="text-xs text-neutral-500">{PRICING_MODE_LABELS[load.pricingMode]}</span>
        {load.fixedPrice && <span className="text-xs font-semibold text-neutral-700">${load.fixedPrice.toLocaleString()}</span>}
      </div>

      {/* Bids stat */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-[#fff8f2] px-3 py-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
          <span className="text-xs font-semibold text-[#fc3f07]">{load.bids.length} bid{load.bids.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/marketplace/loads/${load.id}`}
          className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          style={{ background: '#fc3f07' }}>
          View &amp; Manage
        </Link>
        {(load.status === 'open') && load.bids.length === 0 && (
          <Link href={`/marketplace/loads/${load.id}/edit`}
            className="rounded-xl border border-[#e0d5c8] px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
            Edit
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MyPostedLoadsPage() {
  const [activeTab, setActiveTab] = useState<LoadStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_LOADS.filter((l) => {
    const matchTab = activeTab === 'all' || l.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || l.jobId.toLowerCase().includes(q) || l.origin.toLowerCase().includes(q) || l.destination.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const counts = STATUS_TABS.reduce<Record<string, number>>((acc, t) => {
    acc[t.key] = t.key === 'all' ? MOCK_LOADS.length : MOCK_LOADS.filter((l) => l.status === t.key).length;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />MARKETPLACE
          </span>
          <h1 className="mt-1 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>My Posted Loads</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your active and past load listings.</p>
        </div>
        <Link href="/marketplace/post-load"
          className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          style={{ background: '#fc3f07' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Post a Load
        </Link>
      </div>

      {/* Quick stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total loads', value: MOCK_LOADS.length },
          { label: 'Active bids', value: MOCK_LOADS.reduce((s, l) => s + l.bids.filter((b) => b.status === 'pending').length, 0) },
          { label: 'Booked', value: MOCK_LOADS.filter((l) => l.status === 'booked').length },
          { label: 'Completed', value: MOCK_LOADS.filter((l) => l.status === 'completed').length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#e8e0d6] bg-white p-4 shadow-sm">
            <p className="text-xs text-neutral-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by job ID, route…"
            className="w-full rounded-xl border border-[#e0d5c8] bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20" />
        </div>
      </div>

      {/* Status tabs */}
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {STATUS_TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: activeTab === t.key ? '#fc3f07' : '#e8e0d6',
              background: activeTab === t.key ? '#fff8f2' : '#fff',
              color: activeTab === t.key ? '#d93506' : '#737373',
            }}>
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
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">📦</div>
          <p className="text-base font-medium text-neutral-700">
            {search ? 'No loads match your search.' : activeTab === 'all' ? 'You haven\'t posted any loads yet.' : `No ${activeTab} loads.`}
          </p>
          {!search && activeTab === 'all' && (
            <Link href="/marketplace/post-load"
              className="mt-5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
              style={{ background: '#fc3f07' }}>
              Post your first load →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => <LoadCard key={l.id} load={l} />)}
        </div>
      )}
    </div>
  );
}
