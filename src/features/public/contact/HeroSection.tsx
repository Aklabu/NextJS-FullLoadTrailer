export default function ContactHero() {
  return (
    <header
      style={{
        textAlign: 'center',
        padding: '64px 24px 40px',
        maxWidth: 800,
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#fff',
          border: '1px solid #fed7aa',
          borderRadius: 999,
          padding: '6px 16px',
          fontSize: 12,
          fontWeight: 600,
          color: '#d93506',
          marginBottom: 24,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d93506', display: 'inline-block' }} />
        DIRECT SUPPORT &amp; INQUIRIES
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 400,
          lineHeight: 1.2,
          color: '#1a1a1a',
          marginBottom: 24,
        }}
      >
        Get in Touch with FullTrailerLoad.
        <br />
        <span style={{ fontStyle: 'italic', color: '#fc3f07' }}>
          Direct Support &amp; Rapid Answers
        </span>
      </h1>

      <p
        style={{
          maxWidth: 560,
          margin: '0 auto 32px',
          color: '#6b7280',
          fontSize: 15,
          lineHeight: 1.7,
        }}
      >
        Whether you need onboarding assistance, transaction verification help, or custom fleet solutions, our freight operations team is standing by across all key transit corridors.
      </p>

      {/* Status pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, fontSize: 12, fontWeight: 500 }}>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 999, padding: '8px 16px',
          }}
        >
          ⚡ Average Response: <strong style={{ color: '#d93506' }}>14 Mins</strong>
        </span>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 999, padding: '8px 16px',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
          FMCSA Tier 2 Dispute Desk: Online
        </span>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 999, padding: '8px 16px',
          }}
        >
          🛡 Instant SAFER &amp; COI Sync
        </span>
      </div>
    </header>
  );
}
