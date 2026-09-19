import Link from 'next/link';

const tier1Features = [
  { included: true,  text: 'Instant Public Posting' },
  { included: true,  text: 'One-Click Contact Reveal' },
  { included: true,  text: 'Basic Peer Verification' },
  { included: true,  text: 'Reverse Capacity Feeds' },
  { included: false, text: 'Automated FMCSA SAFER & Insurance Checks' },
  { included: false, text: 'Binding Rate Con & Master Job ID' },
  { included: false, text: 'Job-Scoped Encrypted Messaging' },
];

const tier2Features = [
  'Live FMCSA SAFER API & COI Validation',
  'Legally Binding Rate Counteroffers',
  'Automated Master Rate Con PDF',
  'Job-Linked Encrypted Messaging',
  'Verified Performance Scoring',
];

export default function PricingCards() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
      <div className="pricing-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* Tier 1 */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 32,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#fff7ed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}
              >
                📋
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 2 }}>TIER 1 ARCHITECTURE</div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1a1a' }}>Community Bulletin Board</h2>
              </div>
            </div>
            <span
              style={{
                fontSize: 11, fontWeight: 600, color: '#6b7280',
                background: '#f3f4f6', borderRadius: 999, padding: '4px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              Open Access
            </span>
          </div>

          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
            Rapid spot broadcast of urgent capacity with direct peer-to-peer contact and zero friction.
          </p>

          {/* Price block */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 40, fontWeight: 700, color: '#1a1a1a' }}>$0</span>
              <span style={{ fontSize: 14, color: '#6b7280' }}>/ forever free</span>
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
              ✓ No credit card required • Unlimited ad-hoc community posts &amp; capacity views
            </p>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 12 }}>INCLUDED CAPABILITIES</div>
          <ul style={{ listStyle: 'none', marginBottom: 24 }}>
            {tier1Features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '6px 0', color: f.included ? '#1a1a1a' : '#9ca3af' }}>
                <span style={{ color: f.included ? '#16a34a' : '#9ca3af', fontWeight: 700, flexShrink: 0 }}>
                  {f.included ? '✓' : '−'}
                </span>
                {f.text}
              </li>
            ))}
          </ul>

          <Link
            href="/auth/signup"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: '#fff7ed', color: '#c2622b',
              fontWeight: 600, fontSize: 14,
              borderRadius: 999, padding: '12px 0',
              textDecoration: 'none',
              border: 'none',
              transition: 'background 0.2s',
            }}
          >
            Get Started with Tier 1 (Free) →
          </Link>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
            Ideal for hotshots, casual spot hauls, and regional peer boards
          </p>
        </div>

        {/* Tier 2 */}
        <div
          style={{
            position: 'relative',
            background: '#fff',
            border: '2px solid #d97b3f',
            borderRadius: 16,
            padding: 32,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Top badge */}
          <span
            style={{
              position: 'absolute', top: -16, right: 32,
              background: '#d97b3f', color: '#fff',
              fontSize: 11, fontWeight: 700,
              borderRadius: 999, padding: '6px 16px',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
          >
            ★ INSTITUTIONAL STANDARD
          </span>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#d97b3f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#c2622b', letterSpacing: 1, marginBottom: 2 }}>TIER 2 ARCHITECTURE</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1a1a' }}>Binding Digital Marketplace</h2>
            </div>
          </div>

          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
            Institutional load procurement with automated FMCSA vetting, binding counteroffers, and escrow.
          </p>

          {/* Price block */}
          <div style={{ background: '#fff7ed', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#1a1a1a' }}>Configurable</span>
              <span
                style={{
                  background: '#d97b3f', color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  borderRadius: 10, padding: '8px 12px',
                  textAlign: 'center', lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                }}
              >
                Zero Broker<br />Commission Skim
              </span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#c2622b', marginTop: 8, letterSpacing: 0.3 }}>
              PER-TRANSACTION ESCROW OR DEDICATED MONTHLY RETAINER
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginTop: 12 }}>
              <span>Direct Settlement Guaranteed</span>
              <span>14-Day Full Access Trial Available</span>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 12 }}>EVERYTHING IN TIER 1, PLUS ENTERPRISE SAFEGUARDS:</div>
          <ul style={{ listStyle: 'none', marginBottom: 24 }}>
            {tier2Features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '6px 0', color: '#1a1a1a' }}>
                <span style={{ color: '#c2622b', fontWeight: 700, flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/auth/signup?tier=2"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: '#d97b3f', color: '#fff',
              fontWeight: 600, fontSize: 14,
              borderRadius: 999, padding: '12px 0',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            Select Tier 2 Marketplace Plan →
          </Link>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#c2622b', marginTop: 12 }}>
            Pre-qualify in under 3 minutes • Instant SAFER verification
          </p>
        </div>

      </div>
    </section>
  );
}
