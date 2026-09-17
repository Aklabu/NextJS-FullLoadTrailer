'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Are pricing values fixed or volume-based?',
    a: 'Tier 1 is always free with no volume limits. Tier 2 pricing is configurable — we offer per-transaction escrow pricing for occasional high-value shipments and monthly retainer plans for brokers and fleets moving consistent volume. Contact us for a custom quote.',
  },
  {
    q: 'What does "Start free, upgrade anytime" mean?',
    a: 'You can create an account, post loads, and browse the bulletin board immediately at zero cost. Upgrading to Tier 2 unlocks FMCSA verification, binding bidding, and encrypted messaging — you can trigger the upgrade from your account dashboard at any point with no data loss.',
  },
  {
    q: 'Does FullTrailerLoad take a percentage cut?',
    a: 'No. We do not take a broker commission skim on any transaction. Agreed rates between shipper and carrier are settled directly. Our revenue comes from Tier 2 subscription or escrow service fees — never as a hidden percentage of your load value.',
  },
  {
    q: 'How does carrier verification differ between tiers?',
    a: 'Tier 1 uses basic account-level identity checks. Tier 2 runs automated real-time queries against the FMCSA SAFER database, verifies active Operating Authority (MC/DOT), and checks that a $1M auto liability COI is on file — all before a carrier can bid on marketplace loads.',
  },
  {
    q: 'Can brokers manage volume across multiple dispatchers?',
    a: 'Yes. Broker accounts get access to a Kanban-style dashboard that pipelines all jobs across their team — Needs Carrier, Bidding, Booked, and Completed. Multi-seat and enterprise invoicing options are available under Tier 2.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#fff',
          borderTop: '1px solid #e5e7eb',
          borderRight: '1px solid #e5e7eb',
          borderBottom: open ? 'none' : '1px solid #e5e7eb',
          borderLeft: '1px solid #e5e7eb',
          borderRadius: open ? '12px 12px 0 0' : 12,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          marginBottom: open ? 0 : 12,
          transition: 'border-color 0.15s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
          <span style={{ color: '#d97b3f' }}>●</span>
          {q}
        </span>
        <span style={{ color: '#9ca3af', fontSize: 16, marginLeft: 16, flexShrink: 0 }}>{open ? '↑' : '↓'}</span>
      </button>

      {open && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            padding: '0 24px 16px',
            marginBottom: 12,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 14,
            color: '#6b7280',
            lineHeight: 1.7,
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function PricingFaq() {
  return (
    <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#c2622b', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
          GOT QUESTIONS?
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, color: '#1a1a1a', marginBottom: 8 }}>
          Frequently Asked Billing &amp; Tier Questions
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280' }}>
          Everything you need to know about plans, onboarding, and transaction settlements.
        </p>
      </div>

      <div>
        {faqs.map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}
