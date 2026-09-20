'use client';

import { useState } from 'react';
import Link from 'next/link';

type Tier = 'basic' | 'advanced';

const CURRENT_TIER: Tier = 'basic'; // TODO: from auth context

const TIER_FEATURES = {
  basic: [
    'Post & browse bulletin board listings',
    'Verified badge display',
    'Basic contact reveal',
    'Community network access',
  ],
  advanced: [
    'Everything in Bulletin Board',
    'Structured bidding & counteroffers',
    'Booking confirmations with Job IDs',
    'In-platform job-linked messaging',
    'Carrier capacity postings',
    'Broker pipeline dashboard',
  ],
};

const BILLING_HISTORY = [
  { date: 'Aug 1, 2026', description: 'Bulletin Board — Basic', amount: 'Free', status: 'Active' },
];

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#d97b3f]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function SubscriptionPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="mx-auto max-w-[700px] space-y-6 px-6 py-10">

      {/* Header */}
      <div>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#c2622b]">
          <span className="h-1 w-1 rounded-full bg-[#d97b3f]" aria-hidden="true" />
          ACCOUNT PLAN
        </span>
        <h1
          className="mt-3 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Subscription &amp; Tier
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your plan and access level.
        </p>
      </div>

      {/* Current plan card */}
      <div className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[1px] text-neutral-400">Current plan</p>
            <p
              className="mt-1 text-xl font-normal text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {CURRENT_TIER === 'basic' ? 'Bulletin Board' : 'Marketplace'}
            </p>
          </div>
          <span
            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[1px]"
            style={{
              background: CURRENT_TIER === 'advanced' ? '#fff0e0' : '#f3ede4',
              color: CURRENT_TIER === 'advanced' ? '#c2622b' : '#7a7168',
            }}
          >
            {CURRENT_TIER === 'basic' ? 'FREE — ALWAYS' : 'TIER 2'}
          </span>
        </div>

        <ul className="space-y-2.5">
          {TIER_FEATURES[CURRENT_TIER].map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-700">
              <CheckIcon /> {f}
            </li>
          ))}
        </ul>

        {CURRENT_TIER === 'basic' && (
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
            style={{ background: '#d97b3f' }}
          >
            Upgrade to Marketplace
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Comparison table */}
      <div className="rounded-2xl border border-[#e8e0d6] bg-white shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <h2
            className="text-base font-semibold text-neutral-800"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Plan comparison
          </h2>
        </div>

        <table className="w-full text-sm" aria-label="Plan comparison">
          <thead>
            <tr className="border-t border-[#e8e0d6] bg-[#fafaf8]">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[1px] text-neutral-400">Feature</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[1px] text-neutral-400">Bulletin</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[1px] text-[#c2622b]">Marketplace</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: 'Post & browse listings', basic: true, advanced: true },
              { feature: 'Verified badge display', basic: true, advanced: true },
              { feature: 'Basic contact reveal', basic: true, advanced: true },
              { feature: 'Structured bidding', basic: false, advanced: true },
              { feature: 'Counteroffers', basic: false, advanced: true },
              { feature: 'Booking confirmation + Job ID', basic: false, advanced: true },
              { feature: 'In-platform messaging', basic: false, advanced: true },
              { feature: 'Carrier capacity postings', basic: false, advanced: true },
              { feature: 'Broker dashboard', basic: false, advanced: true },
            ].map((row, i) => (
              <tr key={row.feature} className={`border-t border-[#f0ece6] ${i % 2 === 0 ? '' : 'bg-[#fdfcfb]'}`}>
                <td className="px-6 py-3 text-neutral-700">{row.feature}</td>
                <td className="px-4 py-3 text-center">
                  {row.basic
                    ? <span className="text-emerald-500">✓</span>
                    : <span className="text-neutral-300">–</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  {row.advanced
                    ? <span className="text-[#d97b3f] font-bold">✓</span>
                    : <span className="text-neutral-300">–</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-[#e8e0d6] px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">Pricing values are TBD — contact us for current rates.</span>
            <Link href="/pricing" className="text-xs font-semibold text-[#d97b3f] underline underline-offset-2 hover:text-[#c2622b]">
              View full pricing →
            </Link>
          </div>
        </div>
      </div>

      {/* Billing history */}
      <div className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
        <h2
          className="mb-4 text-base font-semibold text-neutral-800"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Billing history
        </h2>
        {BILLING_HISTORY.length === 0 ? (
          <p className="text-sm text-neutral-400">No billing history yet.</p>
        ) : (
          <div className="divide-y divide-[#f0ece6]">
            {BILLING_HISTORY.map((row) => (
              <div key={row.date} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-800">{row.description}</p>
                  <p className="text-xs text-neutral-400">{row.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-neutral-700">{row.amount}</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">{row.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-neutral-400">
          Payments are pending final client confirmation. Contact{' '}
          <Link href="/contact" className="text-[#d97b3f] underline underline-offset-2 hover:text-[#c2622b]">support</Link>
          {' '}for billing inquiries.
        </p>
      </div>

      {/* Upgrade confirmation modal */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
          role="dialog" aria-modal="true" aria-label="Upgrade to Marketplace"
        >
          <div className="w-full max-w-[440px] rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: '#fff0e0' }} aria-hidden="true">
              🚀
            </div>
            <h3
              className="mb-2 text-xl font-normal text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Upgrade to Marketplace
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-neutral-500">
              Unlock structured bidding, counteroffers, booking confirmations, and in-platform messaging.
              Our team will contact you to confirm pricing and complete the upgrade.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 rounded-xl border border-[#e0d5c8] py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#d97b3f] hover:text-[#d97b3f]"
              >
                Cancel
              </button>
              <Link
                href="/contact?subject=Marketplace+Upgrade"
                onClick={() => setShowUpgradeModal(false)}
                className="flex flex-1 items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
                style={{ background: '#d97b3f' }}
              >
                Request upgrade →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
