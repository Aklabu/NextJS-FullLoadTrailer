import Link from 'next/link';

export default function CtaSection() {
  return (
    <section style={{ padding: '60px 0', background: '#fdf6ee' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            textAlign: 'center',
            background:
              'radial-gradient(circle at 30% 30%, #fbe3c4, transparent 60%), radial-gradient(circle at 70% 60%, #f6d9d3, transparent 60%), #fbeee0',
            borderRadius: 24,
            padding: '70px 40px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              color: '#7a7168',
            }}
          >
            🚀 JOIN FULLTRAILERLOAD NETWORK
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 36,
              fontWeight: 400,
              color: '#2b2420',
              margin: '0 0 16px',
              lineHeight: 1.2,
            }}
          >
            Ready to accelerate your{' '}
            <span style={{ color: '#d97b3f' }}>
              freight
              <br />
              workflows
            </span>
            ?
          </h2>

          {/* Body */}
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#7a7168',
              maxWidth: 500,
              margin: '0 auto 32px',
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Join thousands of verified shippers, freight brokers, and commercial carriers moving high-density freight without phone tag.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 36,
            }}
          >
            <Link
              href="/signup?role=shipper"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                padding: '14px 28px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 14,
                background: '#d97b3f',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              🏠 Sign Up as Shipper / Broker
            </Link>
            <Link
              href="/signup?role=carrier"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                padding: '14px 28px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 14,
                background: '#c2622b',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              🚚 Sign Up as Carrier / Driver
            </Link>
          </div>

          {/* Footnotes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 28,
              flexWrap: 'wrap',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 13,
              color: '#7a7168',
            }}
          >
            <span>💳 No credit card required for Tier 1</span>
            <span>✅ FMCSA &amp; DOT verified network</span>
            <span>⚡ Deploy in under 3 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
