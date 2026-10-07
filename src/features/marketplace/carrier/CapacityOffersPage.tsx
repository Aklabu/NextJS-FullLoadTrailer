'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VerificationBadge from '@/components/VerificationBadge';
import { getCapacityOffers, type CapacityOffer, type CapacityPosting } from '@/features/marketplace/api/capacityBoardApi';
import { ApiError } from '@/lib/api/client';

interface Props {
  id: string;
}

const ROLE_COLORS: Record<'shipper' | 'broker', { bg: string; text: string }> = {
  shipper: { bg: '#dbeafe', text: '#1e40af' },
  broker:  { bg: '#ede9fe', text: '#5b21b6' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-[#e8e0d6] bg-white p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-neutral-100" />
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-neutral-100" />
              <div className="h-3 w-20 rounded bg-neutral-100" />
            </div>
          </div>
          <div className="h-16 rounded-xl bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

function OfferCard({ offer, postingId }: { offer: CapacityOffer; postingId: string }) {
  const roleCfg = ROLE_COLORS[offer.offered_by.role];
  const initials = offer.offered_by.company_name.slice(0, 2).toUpperCase();

  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm transition-all hover:border-[#fc3f07]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ background: '#2b1508' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/profiles/${offer.offered_by.id}`}
                className="text-sm font-semibold text-neutral-800 hover:text-[#fc3f07] transition-colors"
              >
                {offer.offered_by.company_name}
              </Link>
              <VerificationBadge status={offer.offered_by.verification_status as never} />
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[1px]"
                style={{ background: roleCfg.bg, color: roleCfg.text }}
              >
                {offer.offered_by.role}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-neutral-400">{timeAgo(offer.offered_at)}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-700 rounded-xl border border-[#f0ece6] bg-[#fafaf8] px-4 py-3">
        &ldquo;{offer.message}&rdquo;
      </p>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/messages?capacity=${postingId}&company=${offer.offered_by.id}`}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          style={{ background: '#fc3f07' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Reply
        </Link>
        <Link
          href={`/profiles/${offer.offered_by.id}`}
          className="rounded-xl border border-[#e0d5c8] px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
        >
          View profile
        </Link>
      </div>
    </div>
  );
}

export default function CapacityOffersPage({ id }: Props) {
  const router = useRouter();
  const [posting, setPosting] = useState<CapacityPosting | null>(null);
  const [offers, setOffers] = useState<CapacityOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getCapacityOffers(id);
        setPosting(res.data.posting);
        setOffers(res.data.offers);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) { router.push('/auth/login'); return; }
          if (err.status === 404) { setError('Posting not found.'); }
          else { setError(err.message || 'Failed to load offers.'); }
        } else {
          setError('Unable to connect. Check your internet and try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-8">
      <Link
        href="/marketplace/carrier/my-capacity"
        className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        My Capacity Postings
      </Link>

      <div className="mb-6">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
          <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />
          CARRIER · MARKETPLACE
        </span>
        <h1 className="mt-2 text-[clamp(20px,3vw,26px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Offers received
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Shippers and brokers interested in your capacity on this route.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <>
          <div className="mb-6 animate-pulse rounded-2xl border border-[#e8e0d6] bg-white p-4">
            <div className="h-4 w-24 rounded bg-neutral-100 mb-2" />
            <div className="h-5 w-48 rounded bg-neutral-100" />
          </div>
          <Skeleton />
        </>
      ) : posting && (
        <>
          <div className="mb-6 rounded-2xl border border-[#e8e0d6] bg-white p-4 shadow-sm">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">Your posting</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900">{posting.origin}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-neutral-900">{posting.destination}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-xs text-neutral-500">{posting.cubic_feet.toLocaleString()} cu ft</span>
              <span className="text-xs text-neutral-500">{posting.equipment_type}</span>
              <span className="text-xs text-neutral-500">{formatDate(posting.available_from)} – {formatDate(posting.available_to)}</span>
            </div>
          </div>

          <p className="mb-4 text-sm text-neutral-500">
            {offers.length === 0 ? 'No offers yet.' : `${offers.length} offer${offers.length !== 1 ? 's' : ''}`}
          </p>

          {offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">📬</div>
              <p className="text-base font-medium text-neutral-700">No offers yet</p>
              <p className="mt-1 text-sm text-neutral-400">Shippers and brokers can reach out about this capacity posting.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} postingId={posting.id} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
