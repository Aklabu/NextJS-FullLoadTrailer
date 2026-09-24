const tier1Items = [
  { check: true, text: 'Free instant public listing without verification waiting periods' },
  { check: true, text: 'One-click contact reveal for direct mover-to-mover dialogue' },
  { check: true, text: 'Community rating scorecards and peer move testimonials' },
  { check: false, text: 'Manual offline carrier insurance vetting and outside billing' },
];

const tier2Items = [
  { text: 'Automated live FMCSA/USDOT authority check & insurance verification' },
  { text: 'Structured counteroffers with legal offer & acceptance audit stamps' },
  { text: 'Automated Move Confirmation generation with unique Master Job ID' },
  { text: 'Encrypted job-scoped messaging shielding both parties from circumvention' },
];

export default function TiersSection() {
  return (
    <section style={{ padding: '60px 0', background: '#fdf6ee' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Section header */}
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
          GRADUATED FRAMEWORK
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
          Tier 1 vs. Tier 2 Marketplace Architecture
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
          FullTrailerLoad provides two distinct operating tiers designed to support both casual peer-to-peer household goods connections and fully compliant digital move execution.
        </p>

        {/* Tier cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
          className="how-tier-grid"
        >
          {/* Tier 1 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #ece1d3',
              borderRadius: 16,
              padding: 32,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: '#fbeee0',
                  color: '#7a7168',
                }}
              >
                Informal &amp; Instant
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7a7168', letterSpacing: 0.5 }}>TIER 1 ARCHITECTURE</span>
            </div>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: '#2b2420', marginBottom: 12 }}>
              Community Bulletin Board
            </h3>
            <p style={{ fontSize: 14, color: '#7a7168', marginBottom: 20, lineHeight: 1.6 }}>
              Engineered for rapid broadcast of urgent spot capacity and peer-to-peer phone or email connections without regulatory platform escrow.
            </p>

            <ul style={{ listStyle: 'none' }}>
              {tier1Items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, padding: '8px 0', color: '#2b2420' }}>
                  <span style={{ color: item.check ? '#3f8f5f' : '#7a7168', fontWeight: 700, flexShrink: 0 }}>
                    {item.check ? '✓' : '—'}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(0,0,0,0.08)',
                paddingTop: 16,
                fontSize: 12,
                color: '#7a7168',
              }}
            >
              <span>Ideal for: Regional Hotshots &amp; Spot Ad-Hoc Moves</span>
              <span
                style={{
                  background: '#fbeee0',
                  color: '#7a7168',
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 10,
                }}
              >
                Zero Fee
              </span>
            </div>
          </div>

          {/* Tier 2 */}
          <div
            style={{
              background: 'linear-gradient(160deg, #fff3e0, #ffe6cf)',
              border: '1px solid #f0c896',
              borderRadius: 16,
              padding: 32,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: '#fc3f07',
                  color: '#fff',
                }}
              >
                Legally Binding Contract
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7a7168', letterSpacing: 0.5 }}>● TIER 2 ARCHITECTURE</span>
            </div>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: '#2b2420', marginBottom: 12 }}>
              Binding Digital Marketplace
            </h3>
            <p style={{ fontSize: 14, color: '#7a7168', marginBottom: 20, lineHeight: 1.6 }}>
              Full compliance automation: FMCSA programmatic authorization, encrypted in-platform counterbidding, and instant enforceable digital rate confirmations.
            </p>

            <ul style={{ listStyle: 'none' }}>
              {tier2Items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, padding: '8px 0', color: '#2b2420' }}>
                  <span style={{ color: '#d93506', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item.text}
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(0,0,0,0.08)',
                paddingTop: 16,
                fontSize: 12,
                color: '#7a7168',
              }}
            >
              <span>Ideal for: Dedicated Freight Lanes &amp; Enterprise Fleets</span>
              <span
                style={{
                  background: '#fc3f07',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                Full Escrow Protection
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
