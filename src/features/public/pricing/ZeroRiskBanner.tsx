import Link from 'next/link';

export default function ZeroRiskBanner() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
      <div
        style={{
          background: 'linear-gradient(to right, #431407, #7c2d12)',
          borderRadius: 16,
          padding: '40px 48px',
          color: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        className="zero-risk-inner"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#f3a76a', marginBottom: 8 }}>
            🛡 ZERO-RISK COMMITMENT
          </div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, marginBottom: 8, color: '#fff' }}>
            Start on Tier 1 Free. Upgrade Anytime in 1 Click.
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,237,213,0.8)', maxWidth: 440, lineHeight: 1.6 }}>
            Begin on the free bulletin board in seconds, then upgrade to full SAFER compliance and escrow protection anytime.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
          <a
            href="#feature-matrix"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: 14, fontWeight: 600,
              borderRadius: 999, padding: '10px 20px',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            Explore Full Matrix ↓
          </a>
          <Link
            href="/auth/signup"
            style={{
              background: '#d97b3f',
              color: '#fff',
              fontSize: 14, fontWeight: 600,
              borderRadius: 999, padding: '10px 20px',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            Pre-Verify Company Now
          </Link>
        </div>
      </div>
    </section>
  );
}
