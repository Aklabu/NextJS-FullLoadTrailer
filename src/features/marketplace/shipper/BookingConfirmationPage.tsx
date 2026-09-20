'use client';

import Link from 'next/link';

// Stub — replace with GET /api/marketplace/bookings/:id/
const MOCK_BOOKING = {
  jobId: 'FTL-2026-0042',
  bookingId: 'BK-2026-00389',
  confirmedAt: '2026-09-18T16:45:00Z',
  agreedPrice: 2400,
  load: {
    origin: 'Chicago, IL',
    destination: 'Detroit, MI',
    pickupDate: '2026-09-25',
    deliveryDate: '2026-09-26',
    cubicFeet: 1200,
    equipmentType: 'Dry Van',
  },
  shipper: {
    companyName: 'Acme Freight LLC',
    email: 'ops@acmefreight.com',
    phone: '+1 (312) 555-0100',
  },
  carrier: {
    companyName: 'FastHaul LLC',
    email: 'dispatch@fasthaul.com',
    phone: '+1 (773) 555-0200',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function BookingConfirmationPage() {
  const b = MOCK_BOOKING;

  return (
    <div className="mx-auto max-w-[640px] px-6 py-10">

      {/* Success banner */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#c2622b]">
          BOOKING CONFIRMED
        </span>
        <h1 className="mt-1 text-[clamp(24px,4vw,32px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Load booked successfully
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Terms are locked in and both parties have been notified. Confirmed at {formatTs(b.confirmedAt)}.
        </p>
      </div>

      {/* Job ID card */}
      <div className="mb-5 rounded-2xl border-2 border-[#d97b3f] bg-white p-5 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[1.5px] text-neutral-400">Master Job ID</p>
        <p className="mt-1 font-mono text-3xl font-bold text-neutral-900">{b.jobId}</p>
        <p className="mt-0.5 text-xs text-neutral-400">Booking ref: {b.bookingId}</p>
      </div>

      {/* Agreed price */}
      <div className="mb-5 rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[1px] text-neutral-400">Agreed rate</p>
            <p className="mt-1 text-3xl font-bold text-neutral-900">${b.agreedPrice.toLocaleString()}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: '#d1fae5' }} aria-hidden="true">
            🤝
          </div>
        </div>
      </div>

      {/* Route + dates */}
      <div className="mb-5 rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-neutral-800" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Load details</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3ede4] text-xs font-bold text-[#d97b3f]" aria-hidden="true">A</div>
            <div>
              <p className="text-[10px] text-neutral-400">PICKUP · {formatDate(b.load.pickupDate)}</p>
              <p className="text-sm font-semibold text-neutral-800">{b.load.origin}</p>
            </div>
          </div>
          <div className="ml-3.5 h-5 w-px bg-[#e8e0d6]" aria-hidden="true" />
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d1fae5] text-xs font-bold text-emerald-700" aria-hidden="true">B</div>
            <div>
              <p className="text-[10px] text-neutral-400">DELIVERY · {formatDate(b.load.deliveryDate)}</p>
              <p className="text-sm font-semibold text-neutral-800">{b.load.destination}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 border-t border-[#f0ece6] pt-3">
            <div>
              <p className="text-[10px] text-neutral-400">CUBIC FEET</p>
              <p className="text-sm font-medium text-neutral-800">{b.load.cubicFeet.toLocaleString()} cu ft</p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400">EQUIPMENT</p>
              <p className="text-sm font-medium text-neutral-800">{b.load.equipmentType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Both parties */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { role: 'Shipper', party: b.shipper, icon: '📦' },
          { role: 'Carrier', party: b.carrier, icon: '🚚' },
        ].map(({ role, party, icon }) => (
          <div key={role} className="rounded-2xl border border-[#e8e0d6] bg-white p-4 shadow-sm">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[1px] text-neutral-400">
              <span aria-hidden="true">{icon}</span> {role}
            </p>
            <p className="text-sm font-semibold text-neutral-800">{party.companyName}</p>
            <p className="text-xs text-neutral-500">{party.email}</p>
            <p className="text-xs text-neutral-500">{party.phone}</p>
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div className="mb-6 rounded-2xl border border-[#f0c896] bg-[#fffbf5] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[1px] text-[#c2622b]">What happens next</p>
        <ul className="space-y-2.5">
          {[
            'Both parties have been notified by email with this confirmation.',
            'Use in-platform messaging for any pre-pickup coordination.',
            'The carrier will confirm pickup on the scheduled date.',
            'After delivery, both parties can leave a review.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-[#7a4a1a]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#d97b3f] text-[9px] font-bold text-white" aria-hidden="true">{i + 1}</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href={`/messages?job=${b.jobId}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
          style={{ background: '#d97b3f' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Message carrier
        </Link>
        <button type="button" onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-[#e0d5c8] px-5 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#d97b3f] hover:text-[#d97b3f]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print / Download
        </button>
        <Link href="/marketplace/my-loads"
          className="flex items-center gap-2 rounded-xl border border-[#e0d5c8] px-5 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#d97b3f] hover:text-[#d97b3f]">
          Back to my loads
        </Link>
      </div>

    </div>
  );
}
