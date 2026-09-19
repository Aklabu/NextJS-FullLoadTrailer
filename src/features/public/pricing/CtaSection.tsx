import Link from 'next/link';

export default function PricingCta() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 50%, #ffedd5 100%)',
          borderRadius: 24,
          padding: '64px 48px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 999,
            padding: '6px 16px',
            fontSize: 12,
            fontWeight: 600,
            color: '#c2622b',
            marginBottom: 24,
          }}
        >
          🚀 CHOOSE YOUR PATH TO DIRECT FREIGHT
        </div>

        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 38px)',
            fontWeight: 400,
            color: '#1a1a1a',
            marginBottom: 16,
            lineHeight: 1.25,
          }}
        >
          Ready to streamline your{' '}
          <span style={{ fontStyle: 'italic', color: '#d97b3f' }}>freight execution?</span>
        </h2>

        <p style={{ color: '#4b5563', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6, fontSize: 15 }}>
          Join thousands of verified shippers, brokers, and motor carriers moving freight daily.
        </p>

        <div
          style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}
        >
          <Link
            href="/auth/signup"
            style={{
              background: '#fff',
              color: '#1a1a1a',
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 999,
              padding: '12px 24px',
              textDecoration: 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              transition: 'box-shadow 0.2s',
            }}
          >
            Start Free (Tier 1) →
          </Link>
          <Link
            href="/auth/signup?tier=2"
            style={{
              background: '#d97b3f',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 999,
              padding: '12px 24px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s',
            }}
          >
            Choose Tier 2 Marketplace ★
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, fontSize: 13, color: '#6b7280' }}>
          <span>✅ No credit card required for Tier 1</span>
          <span>🛡 FMCSA &amp; DOT Verified Network</span>
          <span>⚡ Setup in under 3 minutes</span>
        </div>
      </div>
    </section>
  );
}
