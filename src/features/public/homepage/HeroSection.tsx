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
    <section className="relative mx-auto min-h-[520px] w-full max-w-[1100px] overflow-hidden rounded-[20px] sm:rounded-none md:rounded-[20px]">

      {/* Background image */}
      <Image
        src="/images/homepage/homepage-truck.png"
        alt="Freight truck on open highway"
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
      <div className="relative z-10 flex min-h-[520px] flex-col px-6 py-9 sm:px-10">

        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/10 px-4 py-1.5 text-[11px] font-bold tracking-[1px] text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d97b3f]" />
            NEXT-GEN FREIGHT EXCHANGE · TIER 1 &amp; TIER 2
          </span>
        </div>

        {/* Main row — left content + right widget */}
        <div className="flex flex-1 flex-wrap items-start justify-between gap-8">

          {/* Left — headline, body, CTAs */}
          <div className="max-w-[480px]">
            <h1
              className="mb-5 text-[clamp(36px,5vw,52px)] font-normal leading-[1.1] text-white"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Full Trailer Loads.
              <br />
              Real Carriers.{' '}
              <span className="italic text-[#d97b3f]">Zero Friction.</span>
            </h1>

            <p className="mb-8 max-w-[420px] text-sm leading-[1.75] text-white/[0.72]">
              Move beyond static, outdated bulletin boards. Seamlessly migrate from informal community capacity broadcasts to verified digital marketplace bidding, binding rate handshakes, and vetted carrier trust.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-[#d97b3f] px-[22px] py-[13px] text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
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
                Explore Methodology →
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="#d97b3f" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Track a Shipment by Job ID
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
                className="shrink-0 cursor-pointer rounded-[7px] border-none bg-[#d97b3f] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#c2622b]"
              >
                Track →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-3">

          <div
            className="inline-flex flex-col gap-0.5 rounded-[10px] border border-white/[0.12] px-4 py-2.5 backdrop-blur-md"
            style={{ background: 'rgba(20,12,8,0.65)' }}
          >
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1px] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              LIVE NETWORK
            </span>
            <span className="text-xs font-semibold text-white">99.4% Verified Carriers</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5 rounded-[10px] bg-white px-4 py-2.5">
              <span className="text-lg text-[#d97b3f]">⚡</span>
              <div>
                <div className="text-xs font-bold text-neutral-900">Avg 14-min</div>
                <div className="text-[11px] text-neutral-500">first counter-offer</div>
              </div>
            </div>
            <div className="rounded-[10px] bg-[#d97b3f] px-4 py-2.5">
              <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[1px] text-white/75">ACTIVE VOLUME</div>
              <div className="text-[13px] font-bold text-white">2,400+ Loads/Mo</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
