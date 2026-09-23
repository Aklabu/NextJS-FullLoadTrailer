'use client';

import { useState } from 'react';

const faqs = [
  'How does automated carrier vetting work before a bid is accepted?',
  'What is the difference between a Tier 1 bulletin posting and a Tier 2 marketplace bid?',
  "Can owner-operators post return capacity before arriving at their destination?",
  'Are rate counteroffers legally binding once accepted?',
  'How does job-linked messaging prevent disintermediation?',
];

const answers = [
  "When a carrier submits a bid, our platform automatically queries the FMCSA SAFER database to verify active Operating Authority, checks $1M auto liability insurance status, and cross-references safety compliance scores — all before the bid surfaces on your dashboard.",
  "A Tier 1 post is an informal community listing with no formal bidding or binding contracts — contact details are revealed directly for offline negotiation. A Tier 2 bid is a structured, platform-governed offer with counteroffer rounds, legal audit stamps, and an auto-generated rate confirmation with a unique Master Job ID.",
  "Yes. Carriers can post reverse capacity listings advertising their scheduled empty return route, available cubic footage, and date window. Verified shippers and brokers can then reach out to fill that space before the truck even arrives at the dropoff.",
  "Once a counteroffer is accepted by either party, the platform generates a legally-timestamped acceptance record and locks the agreed rate into a signed rate confirmation. The enforceability as a legal contract depends on applicable transport law in your jurisdiction.",
  "All pre- and post-booking communication is routed through a job-scoped message thread tied to the specific load and job ID. Neither party's personal contact details or external communication channels are shared until the platform authorises it, eliminating circumvention risk.",
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
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
          borderTop: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          borderLeft: '3px solid #fc3f07',
          background: '#ffffff',
          borderRadius: 10,
          padding: '18px 20px',
          marginBottom: open ? 0 : 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          color: '#2b2420',
          outline: 'none',
        }}
      >
        {question}
        <span style={{ color: '#7a7168', fontSize: 18, marginLeft: 12, flexShrink: 0 }}>
          {open ? '⌃' : '⌄'}
        </span>
      </button>

      {open && (
        <div
          style={{
            background: '#fff',
            borderLeft: '3px solid #f3a76a',
            borderRadius: '0 0 10px 10px',
            padding: '0 20px 18px',
            marginBottom: 12,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 14,
            color: '#7a7168',
            lineHeight: 1.7,
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section style={{ padding: '60px 0', background: '#fdf6ee' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: '#d93506',
            textTransform: 'uppercase',
          }}
        >
          INQUIRIES &amp; TRANSPARENCY
        </p>
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            fontWeight: 400,
            color: '#2b2420',
            margin: '8px 0 8px',
          }}
        >
          Frequently Asked Questions
        </h2>
        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#7a7168',
            fontSize: 14,
            maxWidth: 700,
            marginBottom: 36,
          }}
        >
          Technical, regulatory, and procedural mechanics of the FullTrailerLoad marketplace.
        </p>

        <div>
          {faqs.map((q, i) => (
            <FaqItem key={i} question={q} answer={answers[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
