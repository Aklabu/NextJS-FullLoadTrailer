'use client';

import { useState } from 'react';
import Link from 'next/link';

type CapacityStatus = 'active' | 'expired' | 'deactivated';

interface CapacityPosting {
  id: string;
  origin: string;
  destination: string;
  availableFrom: string;
  availableTo: string;
  cubicFeet: number;
  equipmentType: string;
  notes?: string;
  status: CapacityStatus;
  offersReceived: number;
  postedAt: string;
}

const MOCK_POSTINGS: CapacityPosting[] = [
  { id: 'cp1', origin: 'Chicago, IL', destination: 'Detroit, MI', availableFrom: '2026-09-24', availableTo: '2026-09-26', cubicFeet: 1200, equipmentType: 'Dry Van', notes: 'Flexible on load type.', status: 'active', offersReceived: 2, postedAt: '2026-09-18T10:00:00Z' },
  { id: 'cp2', origin: 'Atlanta, GA', destination: 'Nashville, TN', availableFrom: '2026-09-20', availableTo: '2026-09-22', cubicFeet: 800, equipmentType: 'Flatbed', status: 'expired', offersReceived: 1, postedAt: '2026-09-14T08:00:00Z' },
  { id: 'cp3', origin: 'Dallas, TX', destination: 'Houston, TX', availableFrom: '2026-09-15', availableTo: '2026-09-17', cubicFeet: 600, equipmentType: 'Box Truck', status: 'deactivated', offersReceived: 0, postedAt: '2026-09-10T07:00:00Z' },
];

const STATUS_CONFIG: Record<CapacityStatus, { bg: string; text: string; label: string }> = {
  active:      { bg: '#d1fae5', text: '#065f46', label: 'Active' },
  expired:     { bg: '#f5f5f4', text: '#78716c', label: 'Expired' },
  deactivated: { bg: '#fee2e2', text: '#991b1b', label: 'Deactivated' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function PostingCard({ posting, onDeactivate }: { posting: CapacityPosting; onDeactivate: (id: string) => void }) {
  const cfg = STATUS_CONFIG[posting.status];

  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm transition-all hover:border-[#fc3f07]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">{posting.origin}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            <span className="text-sm font-semibold text-neutral-900">{posting.destination}</span>
          </div>
          <p className="mt-0.5 text-xs text-neutral-400">Posted {formatDate(posting.postedAt)}</p>
        </div>
        <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]" style={{ background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-xs text-neutral-500">{posting.cubicFeet.toLocaleString()} cu ft</span>
        <span className="text-xs text-neutral-500">{posting.equipmentType}</span>
        <span className="text-xs text-neutral-500">{formatDate(posting.availableFrom)} – {formatDate(posting.availableTo)}</span>
      </div>

      {posting.notes && <p className="mb-3 text-xs italic text-neutral-400">{posting.notes}</p>}

      {/* Offers stat */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-[#fff8f2] px-3 py-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
          <span className="text-xs font-semibold text-[#fc3f07]">{posting.offersReceived} offer{posting.offersReceived !== 1 ? 's' : ''} received</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {posting.status === 'active' && (
          <>
            <Link href={`/marketplace/carrier/my-capacity/${posting.id}/edit`}
              className="rounded-xl border border-[#e0d5c8] px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
              Edit
            </Link>
            <button type="button" onClick={() => onDeactivate(posting.id)}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50">
              Deactivate
            </button>
          </>
        )}
        {posting.offersReceived > 0 && (
          <Link href={`/marketplace/carrier/my-capacity/${posting.id}/offers`}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
            style={{ background: '#fc3f07' }}>
            View {posting.offersReceived} offer{posting.offersReceived !== 1 ? 's' : ''} →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MyCapacityPostingsPage() {
  const [postings, setPostings] = useState<CapacityPosting[]>(MOCK_POSTINGS);

  function handleDeactivate(id: string) {
    setPostings((prev) => prev.map((p) => p.id === id ? { ...p, status: 'deactivated' as const } : p));
  }

  const active = postings.filter((p) => p.status === 'active');
  const inactive = postings.filter((p) => p.status !== 'active');

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />CARRIER · MARKETPLACE
          </span>
          <h1 className="mt-1 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>My Capacity Postings</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your available trailer capacity listings.</p>
        </div>
        <Link href="/marketplace/carrier/post-capacity"
          className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          style={{ background: '#fc3f07' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Post Capacity
        </Link>
      </div>

      {postings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">🚚</div>
          <p className="text-base font-medium text-neutral-700">No capacity postings yet</p>
          <p className="mt-1 text-sm text-neutral-400">Advertise your empty trailer space to attract loads.</p>
          <Link href="/marketplace/carrier/post-capacity" className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]" style={{ background: '#fc3f07' }}>
            Post capacity →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[1px] text-neutral-400">Active ({active.length})</h2>
              <div className="space-y-4">{active.map((p) => <PostingCard key={p.id} posting={p} onDeactivate={handleDeactivate} />)}</div>
            </div>
          )}
          {inactive.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[1px] text-neutral-400">Past postings ({inactive.length})</h2>
              <div className="space-y-4">{inactive.map((p) => <PostingCard key={p.id} posting={p} onDeactivate={handleDeactivate} />)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
