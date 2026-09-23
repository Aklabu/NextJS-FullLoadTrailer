'use client';

import { useState } from 'react';

const faqs = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    q: 'How does Tier 1 Bulletin differ from Tier 2 Digital Marketplace?',
    a: 'Tier 1 functions as an open, zero-fee community board where operators connect directly via posted phone/email contacts. Tier 2 introduces our full transaction engine: FMCSA automated vetting, escrow protections, binding counter-negotiations, rate lock confirmations, and encrypted in-platform dispatch messaging.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    q: 'How are carriers and brokers vetted before booking?',
    a: 'For all Tier 2 marketplace interactions, our system executes real-time programmatic queries to FMCSA and DOT registries verifying active operating authority, safety rating status, MC numbers, and active Certificates of Insurance ($1M auto liability + cargo coverage).',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
    q: 'Can I use the platform for partial loads or LTL?',
    a: 'While FullTrailerLoad is engineered primarily for full trailer equipment (Dry Van, Reefer, Flatbed, Step Deck), Tier 1 bulletin postings permit capacity-sharing announcements (e.g., partial trailer floor space or empty return backhauls) when specified in the cubic volume fields.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
    q: 'Are rate counteroffers legally binding?',
    a: "Yes. Under Tier 2 marketplace rules, when a shipper or carrier clicks 'Accept' on a submitted counteroffer, a digital rate confirmation handshake is executed immediately with timestamps, dispatch paperwork, and legal rate obligations locked in our audit ledger.",
  },
];

function FaqItem({ icon, q, a }: { icon: React.ReactNode; q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[#ece1d3] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-6 py-5 text-left"
      >
        <span className="mt-0.5 shrink-0 text-[#fc3f07]">{icon}</span>
        <span className="flex-1 text-sm font-semibold text-neutral-800">{q}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`ml-2 mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-5 pl-[52px]">
          <p className="text-sm leading-relaxed text-[#fc3f07]">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="bg-[#fdf6ee] px-6 pb-20 pt-4">
      <div className="mx-auto max-w-[1100px]">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-[#e8c99a] bg-[#fff0e0] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            PLATFORM CLARITY
          </span>
          <h2
            className="mt-4 text-[clamp(26px,4vw,38px)] font-normal text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-neutral-500">
            Everything you need to{' '}
            <span className="text-[#fc3f07]">know</span> about our graduated freight exchange tiers, vetting, and{' '}
            <span className="text-[#fc3f07]">binding</span> contracts.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <FaqItem key={i} icon={f.icon} q={f.q} a={f.a} />
          ))}
        </div>

      </div>
    </section>
  );
}
