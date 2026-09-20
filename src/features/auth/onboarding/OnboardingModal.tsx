'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { UserRole } from '@/lib/types/auth';

// Slide content
interface Slide {
  step: number;
  badge: string;
  headline: string;
  body: string;
  visual: React.ReactNode;
  tip?: string;
}

// Visual illustrations — inline SVG compositions
function BulletinVisual() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
      style={{ background: 'radial-gradient(ellipse at 60% 40%, #fbe3c4, transparent 70%), #fdf6ee' }}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-3 w-60">
        {[
          { route: 'Chicago → Detroit', type: 'Load Available', badge: 'Verified' },
          { route: 'Atlanta → Nashville', type: 'Capacity Available', badge: 'Basic' },
          { route: 'Dallas → Houston', type: 'Load Available', badge: 'Verified' },
        ].map((card) => (
          <div key={card.route} className="flex items-center justify-between rounded-xl border border-[#e8e0d6] bg-white px-4 py-3 shadow-sm">
            <div>
              <p className="text-xs font-semibold text-neutral-800">{card.route}</p>
              <p className="text-[10px] text-neutral-400">{card.type}</p>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold"
              style={{
                background: card.badge === 'Verified' ? '#d1fae5' : '#e0e7ff',
                color: card.badge === 'Verified' ? '#065f46' : '#3730a3',
              }}
            >
              {card.badge}
            </span>
          </div>
        ))}
        <div className="mt-1 rounded-xl border-2 border-dashed border-[#e0d5c8] bg-white/60 px-4 py-3 text-center">
          <p className="text-xs font-semibold text-[#d97b3f]">+ Create Post</p>
        </div>
      </div>
    </div>
  );
}

function MarketplaceVisual() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
      style={{ background: 'radial-gradient(ellipse at 40% 40%, #f6d9d3, transparent 70%), #fdf6ee' }}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-2 w-64">
        {/* Load card */}
        <div className="rounded-xl border-2 border-[#d97b3f] bg-white px-4 py-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-800">Miami → New York</p>
            <span className="rounded-full bg-[#fff0e0] px-2 py-0.5 text-[9px] font-bold text-[#c2622b]">BIDDING</span>
          </div>
          <p className="text-[10px] text-neutral-400">48-ft flatbed · 1,240 cu ft · Aug 14</p>
        </div>
        {/* Bid rows */}
        {[
          { carrier: 'FastHaul LLC', amount: '$2,400', tag: 'Latest' },
          { carrier: 'RoadLine Co', amount: '$2,250', tag: '' },
        ].map((bid) => (
          <div key={bid.carrier} className="flex items-center justify-between rounded-xl border border-[#e8e0d6] bg-white px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3ede4] text-[10px] font-bold text-[#d97b3f]">
                {bid.carrier[0]}
              </div>
              <p className="text-xs font-medium text-neutral-700">{bid.carrier}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-neutral-900">{bid.amount}</p>
              {bid.tag && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700">{bid.tag}</span>}
            </div>
          </div>
        ))}
        {/* Action row */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl bg-[#d97b3f] py-2 text-center text-[10px] font-bold text-white">Accept</div>
          <div className="flex-1 rounded-xl border border-[#e0d5c8] py-2 text-center text-[10px] font-semibold text-neutral-600">Counter</div>
        </div>
      </div>
    </div>
  );
}

function BiddingVisual() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
      style={{ background: 'radial-gradient(ellipse at 70% 30%, #e6f0f2, transparent 60%), #fdf6ee' }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-4 w-60">
        {/* Flow diagram */}
        {[
          { icon: '📦', label: 'Shipper posts load', color: '#fff0e0', textColor: '#c2622b' },
          { icon: '⬇️', label: '', color: 'transparent', textColor: '#999' },
          { icon: '🚚', label: 'Carrier places bid', color: '#e6f0f2', textColor: '#224248' },
          { icon: '⬇️', label: '', color: 'transparent', textColor: '#999' },
          { icon: '🤝', label: 'Shipper accepts / counters', color: '#d1fae5', textColor: '#065f46' },
          { icon: '⬇️', label: '', color: 'transparent', textColor: '#999' },
          { icon: '📋', label: 'Booking confirmed + Job ID', color: '#f3ede4', textColor: '#7a4a1a' },
        ].map((row, i) =>
          row.label ? (
            <div
              key={i}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5"
              style={{ background: row.color }}
            >
              <span className="text-base">{row.icon}</span>
              <p className="text-xs font-medium" style={{ color: row.textColor }}>{row.label}</p>
            </div>
          ) : (
            <div key={i} className="text-neutral-300 text-xs leading-none">│</div>
          )
        )}
      </div>
    </div>
  );
}

function CtaVisual({ role }: { role: UserRole }) {
  const isCarrier = role === 'carrier';
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 80% 50%, rgba(180,80,10,0.4), transparent 70%), #2b1508' }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <span className="text-4xl">{isCarrier ? '🚚' : '📦'}</span>
        <p
          className="text-base font-normal leading-snug text-white"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {isCarrier ? 'Ready to find your first load?' : 'Ready to post your first load?'}
        </p>
        <div className="rounded-xl bg-[#d97b3f] px-5 py-2.5 text-sm font-semibold text-white">
          {isCarrier ? 'Browse loads →' : 'Post a load →'}
        </div>
      </div>
    </div>
  );
}

function buildSlides(role: UserRole): Slide[] {
  const isCarrier = role === 'carrier';
  return [
    {
      step: 1,
      badge: 'TIER 1 · FREE',
      headline: 'The Bulletin Board',
      body: 'Start by posting or browsing informal freight listings. No pricing, no contracts — just verified peers connecting on available loads and capacity. Perfect for getting familiar with the network.',
      visual: <BulletinVisual />,
      tip: 'Basic verification gets you here. No commitment needed.',
    },
    {
      step: 2,
      badge: 'TIER 2 · MARKETPLACE',
      headline: 'The Marketplace',
      body: 'When you\'re ready for structured deals, the Marketplace unlocks bidding, counteroffers, and binding booking confirmations with a unique Job ID. Every transaction stays on-platform.',
      visual: <MarketplaceVisual />,
      tip: 'Advanced verification required. Upgrade anytime from your account settings.',
    },
    {
      step: 3,
      badge: 'HOW IT WORKS',
      headline: 'Bidding in 4 steps',
      body: 'A shipper posts a load with pricing mode (fixed, best offer, or open bidding). Carriers submit bids. The shipper accepts or counters. Once accepted, a booking confirmation locks in the agreed rate.',
      visual: <BiddingVisual />,
      tip: 'All messaging stays in-platform, tied to the specific job ID.',
    },
    {
      step: 4,
      badge: "YOU'RE ALL SET",
      headline: isCarrier ? 'Start finding loads' : 'Post your first load',
      body: isCarrier
        ? 'Browse verified loads matching your route and equipment, place your first bid, or post available trailer capacity for shippers to find you.'
        : 'Create your first bulletin post to announce available loads or capacity, or jump straight into the marketplace to receive competitive bids.',
      visual: <CtaVisual role={role} />,
    },
  ];
}

interface OnboardingModalProps {
  role: UserRole;
  onFinish: () => void;
}

export default function OnboardingModal({ role, onFinish }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const slides = buildSlides(role);
  const current = slides[step];
  const isLast = step === slides.length - 1;
  const isCarrier = role === 'carrier';

  // Mark seen + call onFinish
  async function dismiss() {
    setClosing(true);
    try {
      await fetch('/api/accounts/me/onboarding-seen/', { method: 'POST' });
    } catch {
      // Non-critical — flag is best-effort
    }
    // Short delay for fade-out animation
    setTimeout(onFinish, 250);
  }

  // Keyboard: Escape to skip, arrow keys to navigate
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
      if (e.key === 'ArrowRight' && !isLast) setStep((s) => s + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isLast]);

  // Trap focus inside modal
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Prevent scroll on body while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-250"
      style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(3px)',
        opacity: closing ? 0 : 1,
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Platform onboarding walkthrough"
    >
      {/* Modal panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex w-full max-w-[860px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none md:flex-row"
        style={{
          maxHeight: '90vh',
          minHeight: 520,
          transform: closing ? 'scale(0.97)' : 'scale(1)',
          transition: 'transform 250ms ease, opacity 250ms ease',
        }}
      >
        {/* Left — visual panel */}
        <div
          className="hidden h-full flex-shrink-0 md:flex md:w-[44%]"
          style={{ minHeight: 480 }}
        >
          {current.visual}
        </div>

        {/* Right — content panel */}
        <div className="flex flex-1 flex-col justify-between p-8">

          {/* Top row — badge + skip */}
          <div className="mb-6 flex items-center justify-between">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-[#fffbf5] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#c2622b]"
            >
              <span className="h-1 w-1 rounded-full bg-[#d97b3f]" aria-hidden="true" />
              {current.badge}
            </span>

            <button
              type="button"
              onClick={dismiss}
              className="text-xs font-medium text-neutral-400 underline underline-offset-2 hover:text-neutral-600"
            >
              Skip
            </button>
          </div>

          {/* Mobile visual */}
          <div className="mb-5 h-36 w-full md:hidden rounded-xl overflow-hidden">
            {current.visual}
          </div>

          {/* Headline + body */}
          <div className="flex-1">
            <h2
              className="mb-3 text-[clamp(22px,3vw,28px)] font-normal leading-tight text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {current.headline}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-500">
              {current.body}
            </p>
            {current.tip && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#f0c896] bg-[#fffbf5] px-4 py-3">
                <span className="mt-0.5 text-sm text-[#d97b3f]" aria-hidden="true">💡</span>
                <p className="text-xs leading-relaxed text-[#7a4a1a]">{current.tip}</p>
              </div>
            )}
          </div>

          {/* Step dots */}
          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Walkthrough steps">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-label={`Step ${i + 1} of ${slides.length}`}
                onClick={() => setStep(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === step ? 20 : 8,
                  height: 8,
                  background: i === step ? '#d97b3f' : '#e8e0d6',
                }}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="mt-5 flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 rounded-xl border border-[#e0d5c8] bg-white px-5 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#d97b3f] hover:text-[#d97b3f]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
            )}

            {!isLast && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
                style={{ background: '#d97b3f' }}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {isLast && (
              // On the final slide, offer role-appropriate CTA link + a plain "finish" button
              <div className="flex flex-1 flex-col gap-2">
                <Link
                  href={isCarrier ? '/marketplace/loads' : '/board'}
                  onClick={dismiss}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
                  style={{ background: '#d97b3f' }}
                >
                  {isCarrier ? 'Browse loads →' : 'Post your first load →'}
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full rounded-xl border border-[#e0d5c8] py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:border-[#d97b3f] hover:text-[#d97b3f]"
                >
                  Go to dashboard
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Close × */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Close onboarding walkthrough"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>
  );
}
