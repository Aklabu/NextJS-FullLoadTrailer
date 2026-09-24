'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

        {/* Main row — left content + right widget */}
        <div className="flex flex-1 flex-wrap items-start justify-between gap-8">

          {/* Left — headline, body, CTAs */}
          <div className="max-w-[480px]">
            <h1
              className="mb-4 text-[clamp(28px,3.8vw,42px)] font-normal leading-[1.15] text-white"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Household Goods Moves.
              <br />
              Real Movers.{' '}
              <span className="italic text-[#fc3f07]">Zero Friction.</span>
            </h1>

            <p className="mb-6 max-w-[420px] text-sm leading-[1.65] text-white/[0.72]">
              Move beyond static, outdated bulletin boards. Connect household goods carriers, brokers, and moving companies in a verified digital marketplace — with real-time bidding, binding move confirmations, and trusted partner networks.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-[#fc3f07] px-[22px] py-[13px] text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
              >
                Get Started / Sign Up
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.22] bg-white/[0.12] px-[22px] py-[13px] text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                How It Works →
              </Link>
            </div>
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

        {/* Bottom stats bar */}
        <div className="mt-7 flex flex-wrap items-end justify-between gap-3">

          <div
            className="inline-flex flex-col gap-0.5 rounded-[10px] border border-white/[0.12] px-4 py-2.5 backdrop-blur-md"
            style={{ background: 'rgba(20,12,8,0.65)' }}
          >
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1px] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              LIVE NETWORK
            </span>
            <span className="text-xs font-semibold text-white">99.4% Verified Movers</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5 rounded-[10px] bg-white px-4 py-2.5">
              <span className="text-lg text-[#fc3f07]">⚡</span>
              <div>
                <div className="text-xs font-bold text-neutral-900">Avg 14-min</div>
                <div className="text-[11px] text-neutral-500">first counter-offer</div>
              </div>
            </div>
            <div className="rounded-[10px] bg-[#fc3f07] px-4 py-2.5">
              <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[1px] text-white/75">ACTIVE VOLUME</div>
              <div className="text-[13px] font-bold text-white">2,400+ Moves/Mo</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
