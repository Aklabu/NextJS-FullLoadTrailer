const phases = [
  {
    num: '01',
    phase: 'PHASE 1',
    icon: '📡',
    title: 'Post & Broadcast',
    description:
      "Shippers post verified freight with exact lane origin, dropoff window, cubic volume & equipment demands (53' Dry Van, Reefer, Flatbed) or broadcast instant Tier 1 bulletin notices.",
    footerLeft: '✅ Lane Corridor Pinging',
    badge: 'AUTO ACTIVE',
    badgeStyle: { background: '#dff1e4', color: '#3f8f5f' },
  },
  {
    num: '02',
    phase: 'PHASE 2',
    icon: '🛡️',
    title: 'FMCSA Vetting & Bidding',
    description:
      'Carriers submit structured offers. Automated pipelines query live DOT authority, $1M auto liability validation, and safety compliance while multi-round transparent counteroffers resolve in minutes.',
    footerLeft: '📋 Immutable Counter Logs',
    badge: 'FMCSA LIVE',
    badgeStyle: { background: '#fbe6b8', color: '#a9782c' },
  },
  {
    num: '03',
    phase: 'PHASE 3',
    icon: '🔖',
    title: 'Lock-in & Rate Confirmation',
    description:
      'Digital rate handshake creates a unified Master Job ID. Legally binding rate confirmations execute automatically, opening secure encrypted job-channel communication.',
    footerLeft: '🔒 Direct Settlement',
    badge: 'ZERO BROKERS',
    badgeStyle: { background: '#fbeee0', color: '#7a7168' },
  },
];

export default function ExecutionSection() {
  return (
    <section style={{ padding: '60px 0', background: '#fdf6ee' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#d93506',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              EXECUTION CADENCE
            </p>
            <h2
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 32,
                fontWeight: 400,
                color: '#2b2420',
              }}
            >
              Post → Bid → Book &amp; Dispatch
            </h2>
          </div>
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#7a7168',
              fontSize: 14,
              maxWidth: 320,
            }}
          >
            Programmatic checkpoints eliminate dry runs, phone tag, and fraudulent double-brokering across every stage.
          </p>
        </div>

        {/* Phase cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
          className="how-phase-grid"
        >
          {phases.map((p) => (
            <div
              key={p.num}
              style={{
                background: '#ffffff',
                border: '1px solid #ece1d3',
                borderRadius: 16,
                padding: 28,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, color: '#7a7168' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#d93506' }}>{p.num}</span>
                  {p.phase}
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fbeee0',
                    fontSize: 16,
                  }}
                >
                  {p.icon}
                </div>
              </div>

              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, marginBottom: 10, color: '#2b2420' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 14, color: '#7a7168', marginBottom: 20, lineHeight: 1.6 }}>
                {p.description}
              </p>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #ece1d3',
                  paddingTop: 16,
                  fontSize: 12,
                }}
              >
                <span style={{ color: '#2b2420' }}>{p.footerLeft}</span>
                <span
                  style={{
                    ...p.badgeStyle,
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: 0.5,
                  }}
                >
                  {p.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
