'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Icon: building (moving company)
function BuildingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-12 w-12 opacity-90" aria-hidden="true">
      <path d="M6 42V14l18-8 18 8v28H30V28h-12v14H6zm6-6h6v-6h-6v6zm0-12h6v-6h-6v6zm12 0h6v-6h-6v6zm12 12h6v-6h-6v6zm0-12h6v-6h-6v6z" />
    </svg>
  );
}

// Icon: truck (carrier)
function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-12 w-12 opacity-90" aria-hidden="true">
      <path d="M4 34v-4h2V14h24v16h2v4H4zm6-4h16V18H10v12zm22 4v-4h2V20l-5-6h-5v-2h6.5L36 19.5V30h2v4h-6zm-24 6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm28 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
}

// Icon: handshake (broker)
function HandshakeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-12 w-12 opacity-90" aria-hidden="true">
      <path d="M27.9 40 16 28.1l2.15-2.15 9.75 9.7 14-14L44 23.7 27.9 40zM4 26.25 14.05 16.2l4.2 4.2-9.8 9.8L4 26.25zm10.4 1.5-2.15-2.15 9.8-9.8L27.2 8H44v16.55l-7.25 7.25-2.15-2.1 6.4-6.4V11h-12.5l-4.1 7.75-10 8.8v.2z" />
    </svg>
  );
}

// Arrow circle icon for card CTA
function ArrowCircle({ dark }: { dark?: boolean }) {
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${dark ? 'border-gray-900 text-gray-900' : 'border-white/60 text-white'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

export default function HeroSection() {
  const [jobId, setJobId] = useState('');
  const router = useRouter();

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (jobId.trim()) {
      router.push(`/tracking?job_id=${encodeURIComponent(jobId.trim())}`);
    }
  }

  return (
    <section className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-[20px] sm:rounded-none md:rounded-[20px]" style={{ minHeight: 'calc(100vh - 120px)' }}>

      {/* Background image */}
      <Image
        src="/images/homepage/homepage-truck.png"
        alt="Moving truck on the highway"
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 1200px) 100vw, 1100px"
      />

      {/* Dark overlay — heavier on left, fades right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(20,12,8,0.92) 0%, rgba(20,12,8,0.75) 45%, rgba(20,12,8,0.30) 75%, rgba(20,12,8,0.10) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col px-6 py-8 sm:px-10" style={{ minHeight: 'calc(100vh - 120px)' }}>

        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/10 px-4 py-1.5 text-[11px] font-bold tracking-[1px] text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fc3f07]" />
            HOUSEHOLD GOODS MOVING MARKETPLACE · TIER 1 &amp; TIER 2
          </span>
        </div>

        {/* Headline + body + track widget row */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-8">

          {/* Left — headline + body */}
          <div className="max-w-[480px]">
            <h1
              className="mb-4 text-[clamp(28px,3.8vw,52px)] font-normal leading-[1.15] text-white"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              The Household<br />
              <span className="text-[#fc3f07]">Moving</span><br />
              Marketplace
            </h1>

            <p className="max-w-[420px] text-sm leading-[1.65] text-white">
              Connect moving companies, carriers,<br />
              and moving brokers. Find loads, post<br />
              available trailer space, and coordinate<br />
              moves in one place.
            </p>
          </div>

          {/* Right — Track widget */}
          <div
            className="w-full shrink-0 rounded-[14px] border border-white/[0.12] p-5 backdrop-blur-md sm:w-auto sm:min-w-[260px] sm:max-w-[320px]"
            style={{ background: 'rgba(20,12,8,0.72)' }}
          >
            <div className="mb-3.5 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.8px] text-white/85">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="#fc3f07" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Track a Move by Job ID
              </span>
              <span className="text-[11px] text-white/45">Public status lookup</span>
            </div>

            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="Enter Job # e.g FTL-8492"
                className="min-w-0 flex-1 rounded-[7px] bg-white/95 px-3.5 py-2.5 font-mono text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 cursor-pointer rounded-[7px] border-none bg-[#fc3f07] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#d93506]"
              >
                Track →
              </button>
            </form>
          </div>

        </div>

        {/* Spacer to push cards to bottom */}
        <div className="flex-1" />

        {/* Role cards row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          {/* Card 1 — Moving Company */}
          <Link
            href="/auth/register?role=shipper"
            className="group flex items-center gap-3 rounded-xl p-3.5 transition-opacity hover:opacity-90"
            style={{ background: '#1C2434' }}
          >
            <div className="shrink-0 text-white">
              <BuildingIcon />
            </div>
            <div className="flex-1 text-white">
              <p className="text-xs font-bold leading-tight opacity-90">I&apos;m a</p>
              <p className="text-sm font-bold leading-tight">Moving Company</p>
              <p className="mt-1 text-xs leading-snug opacity-80">Post a move or<br />find a carrier</p>
            </div>
            <div className="shrink-0">
              <ArrowCircle />
            </div>
          </Link>

          {/* Card 2 — Carrier (orange) */}
          <Link
            href="/auth/register?role=carrier"
            className="group flex items-center gap-3 rounded-xl p-3.5 transition-opacity hover:opacity-90"
            style={{ background: '#fc3f07' }}
          >
            <div className="shrink-0 text-white">
              <TruckIcon />
            </div>
            <div className="flex-1 text-white">
              <p className="text-sm font-bold leading-tight">I&apos;m a Carrier</p>
              <p className="mt-1 text-xs leading-snug opacity-80">Find loads or post<br />empty space</p>
            </div>
            <div className="shrink-0">
              <ArrowCircle />
            </div>
          </Link>

          {/* Card 3 — Moving Broker */}
          <Link
            href="/auth/register?role=broker"
            className="group flex items-center gap-3 rounded-xl bg-white p-3.5 transition-opacity hover:opacity-90"
          >
            <div className="shrink-0 text-gray-900">
              <HandshakeIcon />
            </div>
            <div className="flex-1 text-gray-900">
              <p className="text-xs font-bold leading-tight opacity-70">I&apos;m a</p>
              <p className="text-sm font-bold leading-tight">Moving Broker</p>
              <p className="mt-1 text-xs leading-snug opacity-50">Find moves<br />to cover.</p>
            </div>
            <div className="shrink-0">
              <ArrowCircle dark />
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
}
