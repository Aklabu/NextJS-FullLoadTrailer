'use client';

import Link from 'next/link';
import VerificationBadge from '@/components/VerificationBadge';
import type { VerificationStatus } from '@/lib/types/auth';

interface CapacityOffer {
  id: string;
  offeredBy: {
    id: string;
    companyName: string;
    role: 'shipper' | 'broker';
    verificationStatus: VerificationStatus;
  };
  message: string;
  offeredAt: string;
}

interface CapacityPostingSummary {
  id: string;
  origin: string;
  destination: string;
  availableFrom: string;
  availableTo: string;
  cubicFeet: number;
  equipmentType: string;
}

// Stub — replace with GET /api/marketplace/capacity/:id/offers/
const MOCK_POSTING: CapacityPostingSummary = {
  id: 'cp1',
  origin: 'Chicago, IL',
  destination: 'Detroit, MI',
  availableFrom: '2026-09-24',
  availableTo: '2026-09-26',
  cubicFeet: 1200,
  equipmentType: 'Dry Van (Side Door)',
};

const MOCK_OFFERS: CapacityOffer[] = [
  {
    id: 'o1',
    offeredBy: { id: 's1', companyName: 'Acme Freight LLC', role: 'shipper', verificationStatus: 'verified' },
    message: 'We have a load of household goods heading from Chicago to Detroit on Sep 25. Around 1,100 cu ft. Would your trailer work?',
    offeredAt: '2026-09-19T09:30:00Z',
  },
  {
    id: 'o2',
    offeredBy: { id: 'b1', companyName: 'BridgeLogistics', role: 'broker', verificationStatus: 'verified' },
    message: 'Interested in your capacity. We have a client load — dry goods, ~900 cu ft, same route window. Can we discuss rates?',
    offeredAt: '2026-09-19T14:15:00Z',
  },
];

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

function OfferCard({ offer, postingId }: { offer: CapacityOffer; postingId: string }) {
  const roleCfg = ROLE_COLORS[offer.offeredBy.role];
  const initials = offer.offeredBy.companyName.slice(0, 2).toUpperCase();

  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm transition-all hover:border-[#fc3f07]">
      <div className="flex items-start justify-between gap-4">
        {/* Company info */}
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
                href={`/profiles/${offer.offeredBy.id}`}
                className="text-sm font-semibold text-neutral-800 hover:text-[#fc3f07] transition-colors"
              >
                {offer.offeredBy.companyName}
              </Link>
              <VerificationBadge status={offer.offeredBy.verificationStatus} />
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[1px]"
                style={{ background: roleCfg.bg, color: roleCfg.text }}
              >
                {offer.offeredBy.role}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-neutral-400">{timeAgo(offer.offeredAt)}</p>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="mt-4 text-sm leading-relaxed text-neutral-700 rounded-xl border border-[#f0ece6] bg-[#fafaf8] px-4 py-3">
        "{offer.message}"
      </p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/messages?capacity=${postingId}&company=${offer.offeredBy.id}`}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          style={{ background: '#fc3f07' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Reply
        </Link>
        <Link
          href={`/profiles/${offer.offeredBy.id}`}
          className="rounded-xl border border-[#e0d5c8] px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
        >
          View profile
        </Link>
      </div>
    </div>
  );
}

export default function CapacityOffersPage() {
  const posting = MOCK_POSTING;
  const offers = MOCK_OFFERS;

  return (
    <div className="mx-auto max-w-[720px] px-6 py-8">
      {/* Back link */}
      <Link
        href="/marketplace/carrier/my-capacity"
        className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        My Capacity Postings
      </Link>

      {/* Header */}
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

      {/* Posting summary card */}
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
          <span className="text-xs text-neutral-500">{posting.cubicFeet.toLocaleString()} cu ft</span>
          <span className="text-xs text-neutral-500">{posting.equipmentType}</span>
          <span className="text-xs text-neutral-500">{formatDate(posting.availableFrom)} – {formatDate(posting.availableTo)}</span>
        </div>
      </div>

      {/* Offers count */}
      <p className="mb-4 text-sm text-neutral-500">
        {offers.length === 0 ? 'No offers yet.' : `${offers.length} offer${offers.length !== 1 ? 's' : ''}`}
      </p>

      {/* Offer list */}
      {offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
            style={{ background: '#f3ede4' }}
            aria-hidden="true"
          >
            📬
          </div>
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
    </div>
  );
}
