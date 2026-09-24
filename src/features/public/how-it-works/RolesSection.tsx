const demandSteps = [
  {
    title: 'Define Move Specifications',
    body: 'Specify origin, destination, cubic footage, weight, access requirements, and choose between a fixed price or open bidding window for your household goods move.',
  },
  {
    title: 'Screen Verified Movers In Real Time',
    body: 'Incoming bids reveal carrier USDOT authority, active cargo insurance, safety ratings, and historic on-time completion performance.',
  },
  {
    title: 'Negotiate Counteroffers Transparently',
    body: 'Accept the best quote or send binding counteroffers. Expiration timers create urgency without endless phone tag or back-and-forth emails.',
  },
  {
    title: 'Binding Move Confirmation & Encrypted Handshake',
    body: 'Receive instant system-signed move confirmations, HHG bill of lading generation, and direct job-linked in-platform messaging in your dashboard.',
  },
];

const supplySteps = [
  {
    title: 'Discover Verified Household Goods Jobs',
    body: 'Filter available moves by origin, destination, cubic footage, move date, and truck type — and bid directly on jobs that fit your schedule and capacity.',
  },
  {
    title: 'Direct Transparent Bidding',
    body: 'Place bids at your true cost. See real-time market feedback and connect directly with moving companies and brokers — no mystery middlemen cutting your margin.',
  },
  {
    title: 'Post Available Return Capacity',
    body: 'Reverse listing broadcasts your scheduled destination and available truck space, letting verified moving companies book your empty return before you arrive.',
  },
  {
    title: 'Guaranteed Move Lock & Swift Settlement',
    body: 'Accepted bids lock into a binding move confirmation with clear payment terms and fast digital settlement upon job completion and delivery confirmation.',
  },
];

function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ul style={{ listStyle: 'none', marginTop: 20 }}>
      {steps.map((s, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: 14,
            padding: '14px 0',
            borderTop: '1px solid #ece1d3',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#fc3f07',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 14, marginBottom: 3, color: '#2b2420' }}>{s.title}</strong>
            <span style={{ fontSize: 13, color: '#7a7168', lineHeight: 1.5 }}>{s.body}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function RolesSection() {
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
              ROLE PERSPECTIVES
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 400, color: '#2b2420' }}>
              Role Workflows Compared
            </h2>
          </div>
          <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#7a7168', fontSize: 14 }}>
            Dual-perspective view for moving companies and carriers
          </p>
        </div>

        {/* Role cards grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
          className="how-role-grid"
        >
          {/* Demand card */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #ece1d3',
              borderRadius: 16,
              overflow: 'hidden',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ height: 4, background: 'linear-gradient(90deg, #fc3f07, #c1414f)' }} />
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#fbeee0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    🏠
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#2b2420' }}>Moving Companies &amp; Brokers</h3>
                    <div style={{ fontSize: 12, color: '#7a7168' }}>Demand-side move workflow</div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: '#fbeee0',
                    color: '#d93506',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Demand Flow
                </span>
              </div>

              <StepList steps={demandSteps} />

              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fbeee0',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontSize: 13,
                  color: '#2b2420',
                }}
              >
                <span>⏱ Avg. time-to-book reduced from 2.5 hrs to +14 mins</span>
                <span
                  style={{
                    background: '#fc3f07',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                    marginLeft: 8,
                  }}
                >
                  91% faster
                </span>
              </div>
            </div>
          </div>

          {/* Supply card */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #ece1d3',
              borderRadius: 16,
              overflow: 'hidden',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ height: 4, background: 'linear-gradient(90deg, #e8c34a, #fc3f07)' }} />
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#fbeee0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    🚚
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#2b2420' }}>HHG Carriers &amp; Owner-Operators</h3>
                    <div style={{ fontSize: 12, color: '#7a7168' }}>Capacity-side fulfillment workflow</div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: '#fbeee0',
                    color: '#d93506',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Supply Flow
                </span>
              </div>

              <StepList steps={supplySteps} />

              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fbeee0',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontSize: 13,
                  color: '#2b2420',
                }}
              >
                <span>✅ Zero mystery middlemen &amp; direct moving company negotiations</span>
                <span
                  style={{
                    background: '#fc3f07',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                    marginLeft: 8,
                  }}
                >
                  100% Direct
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
