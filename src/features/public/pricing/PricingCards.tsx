import Link from 'next/link';

const tier1Features = [
  { included: true,  text: 'Real-time chat & community feed' },
  { included: true,  text: 'Post loads and available trucks' },
  { included: true,  text: 'Private messaging' },
  { included: true,  text: 'Share photos and documents' },
  { included: true,  text: 'Search and filter by category' },
  { included: true,  text: 'Basic member screening' },
  { included: true,  text: 'DOT / MC information (required)' },
  { included: true,  text: 'COI (basic / required)' },
  { included: true,  text: 'Notifications' },
  { included: false, text: 'Bidding & matching' },
  { included: false, text: 'Tracking & transactions' },
];

const tier2Features = [
  'Everything in Tier 1',
  'Structured load listings & bidding',
  'Carrier / mover matching',
  'Advanced & third-party verification',
  'DOT / MC full verification + COI',
  'Document management',
  'Shipment tracking',
  'Booking & transactions',
  'Closing sheet',
  'Notifications',
];

export default function PricingCards() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
      <div className="pricing-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>

        {/* Tier 1 */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 32,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
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
                💬
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 2 }}>TIER 1</div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1a1a' }}>Community</h2>
              </div>
            </div>
            <span
              style={{
                fontSize: 11, fontWeight: 600, color: '#6b7280',
                background: '#f3f4f6', borderRadius: 999, padding: '4px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              Low-Cost Membership
            </span>
          </div>

          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
            One industry-wide chat for the moving &amp; transportation industry. Chat, post, share opportunities, and stay connected — all in one place.
          </p>

          {/* Price block */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 40, fontWeight: 700, color: '#1a1a1a' }}>Low-Cost</span>
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
              ✓ Community access • Connect with carriers, shippers &amp; brokers industry-wide
            </p>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 12 }}>INCLUDED</div>
          <ul style={{ listStyle: 'none', marginBottom: 24, flexGrow: 1 }}>
            {tier1Features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '6px 0', color: f.included ? '#1a1a1a' : '#9ca3af' }}>
                <span style={{ color: f.included ? '#16a34a' : '#9ca3af', fontWeight: 700, flexShrink: 0 }}>
                  {f.included ? '✓' : '✕'}
                </span>
                {f.text}
              </li>
            ))}
          </ul>

          <Link
            href="/auth/signup"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: '#fff7ed', color: '#d93506',
              fontWeight: 600, fontSize: 14,
              borderRadius: 999, padding: '12px 0',
              textDecoration: 'none',
              border: 'none',
              transition: 'background 0.2s',
            }}
          >
            Get Started with Tier 1 →
          </Link>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
            Ideal for staying connected across the moving &amp; transportation industry
          </p>
        </div>

        {/* Tier 2 */}
        <div
          style={{
            position: 'relative',
            background: '#fff',
            border: '2px solid #fc3f07',
            borderRadius: 16,
            padding: 32,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top badge */}
          <span
            style={{
              position: 'absolute', top: -16, right: 32,
              background: '#fc3f07', color: '#fff',
              fontSize: 11, fontWeight: 700,
              borderRadius: 999, padding: '6px 16px',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
          >
            ★ FULL MARKETPLACE
          </span>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#fc3f07',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#d93506', letterSpacing: 1, marginBottom: 2 }}>TIER 2</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1a1a' }}>Marketplace</h2>
            </div>
          </div>

          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
            Turn opportunities into verified transactions. Bidding, matching, verification, documents, tracking, and more.
          </p>

          {/* Price block */}
          <div style={{ background: '#fff7ed', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#1a1a1a' }}>Configurable</span>
              <span
                style={{
                  background: '#fc3f07', color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  borderRadius: 10, padding: '8px 12px',
                  textAlign: 'center', lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                }}
              >
                Higher Subscription<br />&amp; Transaction Revenue
              </span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#d93506', marginTop: 8, letterSpacing: 0.3 }}>
              SUBSCRIPTION + TRANSACTION-BASED PRICING
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginTop: 12 }}>
              <span>Full verification &amp; compliance</span>
              <span>Start free, upgrade anytime</span>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 12 }}>INCLUDED</div>
          <ul style={{ listStyle: 'none', marginBottom: 24, flexGrow: 1 }}>
            {tier2Features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '6px 0', color: '#1a1a1a' }}>
                <span style={{ color: '#d93506', fontWeight: 700, flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/auth/signup?tier=2"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: '#fc3f07', color: '#fff',
              fontWeight: 600, fontSize: 14,
              borderRadius: 999, padding: '12px 0',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            Get Started with Tier 2 →
          </Link>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#d93506', marginTop: 12 }}>
            Pre-qualify in minutes • Full verification &amp; transaction support
          </p>
        </div>

      </div>
    </section>
  );
}
