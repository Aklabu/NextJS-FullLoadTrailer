'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import VerificationBadge from '@/components/VerificationBadge';
import type { BoardPost, BoardFilters, EquipmentType } from './types';
import { EQUIPMENT_LABELS, POST_TYPE_LABELS } from './types';

// Stub data — replace with GET /api/board/posts/
const MOCK_POSTS: BoardPost[] = [
  {
    id: '1', postType: 'load_available', origin: 'Chicago, IL', destination: 'Detroit, MI',
    equipmentType: 'moving_trailer', cubicFeet: 1200, pickupDate: '2026-09-25',
    description: 'Full trailer of household goods. Need reliable carrier with experience in residential moves.',
    postedAt: '2026-09-19T08:30:00Z',
    poster: { id: 'p1', companyName: 'Acme Freight LLC', verificationStatus: 'verified' },
  },
  {
    id: '2', postType: 'truck_trailer_available', origin: 'Atlanta, GA', destination: 'Nashville, TN',
    equipmentType: 'dry_van_side_door', cubicFeet: 800, pickupDate: '2026-09-26',
    description: 'Return haul capacity available. Flexible on load type.',
    postedAt: '2026-09-19T07:15:00Z',
    poster: { id: 'p2', companyName: 'SouthHaul Carriers', verificationStatus: 'basic' },
  },
  {
    id: '3', postType: 'load_available', origin: 'Dallas, TX', destination: 'Houston, TX',
    equipmentType: 'box_truck', cubicFeet: 600, pickupDate: '2026-09-24',
    description: 'Office relocation. Fragile items included, careful handling required.',
    postedAt: '2026-09-18T14:00:00Z',
    poster: { id: 'p3', companyName: 'TexasPro Moving', verificationStatus: 'verified' },
  },
  {
    id: '4', postType: 'truck_trailer_available', origin: 'Phoenix, AZ', destination: 'Los Angeles, CA',
    equipmentType: 'moving_trailer', cubicFeet: 1400, pickupDate: '2026-09-27',
    description: 'Running empty to LA — looking to fill the trailer. Any load type welcome.',
    postedAt: '2026-09-18T11:45:00Z',
    poster: { id: 'p4', companyName: 'Desert Logistics', verificationStatus: 'verified' },
  },
  {
    id: '5', postType: 'load_available', origin: 'Seattle, WA', destination: 'Portland, OR',
    equipmentType: 'box_truck', cubicFeet: 350, pickupDate: '2026-09-23',
    description: 'Small business inventory shipment. Time-sensitive.',
    postedAt: '2026-09-17T09:00:00Z',
    poster: { id: 'p5', companyName: 'Pacific Freight Co.', verificationStatus: 'basic' },
  },
  {
    id: '6', postType: 'load_available', origin: 'Miami, FL', destination: 'Orlando, FL',
    equipmentType: 'dry_van_side_door', cubicFeet: 900, pickupDate: '2026-09-28',
    description: 'Household goods — side door access required at destination.',
    postedAt: '2026-09-17T06:30:00Z',
    poster: { id: 'p6', companyName: 'SunState Shippers', verificationStatus: 'verified' },
  },
];

const EMPTY_FILTERS: BoardFilters = {
  origin: '', destination: '', dateFrom: '', dateTo: '',
  equipmentType: 'any', postType: 'all',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Filter bar
function FilterBar({
  filters, onChange, onReset,
}: {
  filters: BoardFilters;
  onChange: (k: keyof BoardFilters, v: string) => void;
  onReset: () => void;
}) {
  const hasActive = Object.entries(filters).some(([k, v]) =>
    k === 'equipmentType' ? v !== 'any' : k === 'postType' ? v !== 'all' : v !== ''
  );

  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Origin */}
        <div>
          <label htmlFor="filter-origin" className="mb-1 block text-xs font-medium text-neutral-500">Origin</label>
          <input
            id="filter-origin" type="text" value={filters.origin}
            onChange={(e) => onChange('origin', e.target.value)}
            placeholder="e.g. Chicago, IL"
            className="w-full rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20"
          />
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="filter-dest" className="mb-1 block text-xs font-medium text-neutral-500">Destination</label>
          <input
            id="filter-dest" type="text" value={filters.destination}
            onChange={(e) => onChange('destination', e.target.value)}
            placeholder="e.g. Detroit, MI"
            className="w-full rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20"
          />
        </div>

        {/* Equipment type */}
        <div>
          <label htmlFor="filter-equipment" className="mb-1 block text-xs font-medium text-neutral-500">Equipment</label>
          <select
            id="filter-equipment" value={filters.equipmentType}
            onChange={(e) => onChange('equipmentType', e.target.value)}
            className="w-full rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#fc3f07] appearance-none"
          >
            {(Object.keys(EQUIPMENT_LABELS) as EquipmentType[]).map((k) => (
              <option key={k} value={k}>{EQUIPMENT_LABELS[k]}</option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div>
          <label htmlFor="filter-from" className="mb-1 block text-xs font-medium text-neutral-500">Pickup from</label>
          <input
            id="filter-from" type="date" value={filters.dateFrom}
            onChange={(e) => onChange('dateFrom', e.target.value)}
            className="w-full rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#fc3f07]"
          />
        </div>

        {/* Date to */}
        <div>
          <label htmlFor="filter-to" className="mb-1 block text-xs font-medium text-neutral-500">Pickup to</label>
          <input
            id="filter-to" type="date" value={filters.dateTo}
            onChange={(e) => onChange('dateTo', e.target.value)}
            className="w-full rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#fc3f07]"
          />
        </div>

        {/* Post type */}
        <div>
          <label htmlFor="filter-type" className="mb-1 block text-xs font-medium text-neutral-500">Post type</label>
          <select
            id="filter-type" value={filters.postType}
            onChange={(e) => onChange('postType', e.target.value)}
            className="w-full rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#fc3f07] appearance-none"
          >
            <option value="all">All posts</option>
            <option value="load_available">Load Available</option>
            <option value="truck_trailer_available">Truck / Trailer Available</option>
          </select>
        </div>
      </div>

      {hasActive && (
        <div className="mt-3 flex justify-end">
          <button
            type="button" onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-[#fc3f07] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

// Post card
function PostCard({ post }: { post: BoardPost }) {
  const isLoad = post.postType === 'load_available';

  return (
    <div className="group rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm transition-all hover:border-[#fc3f07] hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* Post type pill */}
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]"
          style={{
            background: isLoad ? '#fff0e0' : '#e6f0f2',
            color: isLoad ? '#d93506' : '#224248',
          }}
        >
          {POST_TYPE_LABELS[post.postType]}
        </span>

        <span className="text-[11px] text-neutral-400">{timeAgo(post.postedAt)}</span>
      </div>

      {/* Route */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-neutral-900">{post.origin}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-semibold text-neutral-900">{post.destination}</span>
      </div>

      {/* Meta row */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
          {post.cubicFeet.toLocaleString()} cu ft
        </span>
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(post.pickupDate)}
        </span>
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4h13l1 9H4L3 4z" />
          </svg>
          {EQUIPMENT_LABELS[post.equipmentType]}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-neutral-500">
        {post.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {/* Poster */}
        <Link
          href={`/profiles/${post.poster.id}`}
          className="flex items-center gap-2 min-w-0"
        >
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: '#2b1508' }}
            aria-hidden="true"
          >
            {post.poster.companyName.slice(0, 2).toUpperCase()}
          </div>
          <span className="truncate text-xs font-medium text-neutral-600 hover:text-[#fc3f07] transition-colors">
            {post.poster.companyName}
          </span>
          <VerificationBadge status={post.poster.verificationStatus} />
        </Link>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/board/${post.id}`}
            className="rounded-lg border border-[#e0d5c8] px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
          >
            View
          </Link>
          <Link
            href={`/board/${post.id}#contact`}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#d93506]"
            style={{ background: '#fc3f07' }}
          >
            Contact Poster
          </Link>
        </div>
      </div>
    </div>
  );
}

// Skeleton card
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e8e0d6] bg-white p-5">
      <div className="flex justify-between">
        <div className="h-5 w-28 rounded-full bg-neutral-100" />
        <div className="h-4 w-14 rounded bg-neutral-100" />
      </div>
      <div className="mt-3 h-5 w-48 rounded bg-neutral-100" />
      <div className="mt-2.5 flex gap-4">
        <div className="h-4 w-20 rounded bg-neutral-100" />
        <div className="h-4 w-24 rounded bg-neutral-100" />
        <div className="h-4 w-16 rounded bg-neutral-100" />
      </div>
      <div className="mt-3 h-8 rounded bg-neutral-100" />
      <div className="mt-4 flex justify-between">
        <div className="h-5 w-32 rounded bg-neutral-100" />
        <div className="h-7 w-28 rounded-lg bg-neutral-100" />
      </div>
    </div>
  );
}

const PAGE_SIZE = 6;

export default function BoardFeedPage() {
  const [filters, setFilters] = useState<BoardFilters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [page, setPage] = useState(1);

  // Simulate API fetch with filters
  const fetchPosts = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      let result = [...MOCK_POSTS];
      if (filters.origin) result = result.filter((p) => p.origin.toLowerCase().includes(filters.origin.toLowerCase()));
      if (filters.destination) result = result.filter((p) => p.destination.toLowerCase().includes(filters.destination.toLowerCase()));
      if (filters.equipmentType !== 'any') result = result.filter((p) => p.equipmentType === filters.equipmentType);
      if (filters.postType !== 'all') result = result.filter((p) => p.postType === filters.postType);
      if (filters.dateFrom) result = result.filter((p) => p.pickupDate >= filters.dateFrom);
      if (filters.dateTo) result = result.filter((p) => p.pickupDate <= filters.dateTo);
      setPosts(result);
      setPage(1);
      setLoading(false);
    }, 500);
  }, [filters]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function handleFilterChange(key: keyof BoardFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
  }

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const pagePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8">

      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />
            TIER 1 · BULLETIN BOARD
          </span>
          <h1
            className="mt-1 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Community Board
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Browse informal load and capacity posts from verified peers.
          </p>
        </div>

        <Link
          href="/board/create"
          className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          style={{ background: '#fc3f07' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Post
        </Link>
      </div>

      {/* Filter bar */}
      <div className="mb-6">
        <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />
      </div>

      {/* Results count */}
      {!loading && (
        <p className="mb-4 text-sm text-neutral-500">
          {posts.length === 0 ? 'No posts found' : `${posts.length} post${posts.length !== 1 ? 's' : ''} found`}
          {Object.entries(filters).some(([k, v]) => k === 'equipmentType' ? v !== 'any' : k === 'postType' ? v !== 'all' : v !== '') && ' (filtered)'}
        </p>
      )}

      {/* Post grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">
            📋
          </div>
          <p className="text-base font-medium text-neutral-700">No posts match your filters</p>
          <p className="mt-1 text-sm text-neutral-400">Try adjusting your search or clear the filters.</p>
          <div className="mt-5 flex gap-3">
            <button
              type="button" onClick={handleReset}
              className="rounded-xl border border-[#e0d5c8] px-5 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
            >
              Clear filters
            </button>
            <Link
              href="/board/create"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
              style={{ background: '#fc3f07' }}
            >
              Create a post
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pagePosts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0d5c8] text-sm text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07] disabled:opacity-40"
            aria-label="Previous page"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === page ? 'page' : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-medium transition-colors"
              style={{
                borderColor: n === page ? '#fc3f07' : '#e0d5c8',
                background: n === page ? '#fc3f07' : '#fff',
                color: n === page ? '#fff' : '#525252',
              }}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0d5c8] text-sm text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07] disabled:opacity-40"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}

    </div>
  );
}
