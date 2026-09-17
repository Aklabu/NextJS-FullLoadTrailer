import Link from 'next/link';

const faqs = [
  {
    icon: '📋',
    q: 'How long does SAFER and COI verification take?',
    a: 'Standard FMCSA records and insurance certificates are parsed instantly via programmatic lookup for Tier 2 carriers. Manual policy endorsements or custom additional insured clauses are reviewed within 2 hours.',
    link: null,
  },
  {
    icon: '📍',
    q: 'Where can I track an active shipment?',
    a: 'Every dispatched rate confirmation contains an authenticated telemetry token. Shippers and dispatchers can enter this token into our public Tracking Lookup page for real-time corridor GPS coordinates.',
    link: { label: 'Open Public Tracker ↗', href: '/tracking' },
  },
  {
    icon: '🔁',
    q: 'Can I change my registered role (Carrier vs. Shipper)?',
    a: 'Dual-authority logistics entities can toggle views inside Company Settings. If you initially onboarded with a carrier profile and need broker or shipper authority enabled, our compliance desk will activate it after validating authority credentials.',
    link: null,
  },
  {
    icon: '⚖️',
    q: 'What if I experience a dispute during counteroffers?',
    a: 'FullTrailerLoad enforces transparent negotiation locks. If a counteroffer is accepted but terms are contested prior to dispatch, our automated escrow holds funds until both parties confirm rate consistency.',
    link: null,
  },
];

export default function ContactFaq() {
  return (
    <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#c2622b', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
          RAPID SELF-SERVICE
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, color: '#1a1a1a', marginBottom: 8 }}>
          Frequently Resolved Inquiries
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280' }}>
          Instant answers to high-frequency carrier and shipper queries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="contact-faq-grid">
        {faqs.map((f, i) => (
          <div key={i} style={{ background: '#f7ece0', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <span style={{ color: '#c2622b', fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1a1a1a', lineHeight: 1.3 }}>
                {f.q}
              </h3>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: f.link ? 12 : 0 }}>
              {f.a}
            </p>
            {f.link && (
              <Link
                href={f.link.href}
                style={{
                  fontSize: 14, fontWeight: 600, color: '#c2622b',
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                {f.link.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
