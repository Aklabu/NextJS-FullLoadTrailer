const demandSteps = [
  {
    title: 'Define Specifications & Equipment',
    body: 'Specify origin, dropoff, cubic volume, weight, liftgate requirements, and choose between a target Buy-It-Now or dynamic auction window.',
  },
  {
    title: 'Screen Verified Carriers In Real Time',
    body: 'Incoming bids reveal carrier safety ratings, active Operating Authority, inspected fleets, and historic on-time arrival performance.',
  },
  {
    title: 'Negotiate Counteroffers Transparently',
    body: 'Accept optimal quotes or send binding counteroffers. Expiration counters create urgency without endless phone negotiations.',
  },
  {
    title: 'Automated Dispatch & Encrypted Handshake',
    body: 'Receive instant system-signed rate confirmations, BOL generation, and automated telemetry tracking directly in your dashboard.',
  },
];

const supplySteps = [
  {
    title: 'Discover High-Density Verified Lanes',
    body: 'Filter regional freight matches by equipment spec (Dry Van, Reefer, Flatbed), deadhead radius, and guaranteed payment credentials.',
  },
  {
    title: 'Direct Transparent Bidding',
    body: 'Place bids at your true cost-per-mile. See real-time market feedback and eliminate unnecessary brokerage cuts that erode margins.',
  },
  {
    title: 'Post Empty Backhaul Capacity',
    body: 'Reverse listing broadcasts your scheduled destination dropoffs, letting vetted shippers secure your empty space days before arrival.',
  },
  {
    title: 'Guaranteed Rate Lock & Swift Settlements',
    body: 'Accepted rates lock programmatically into a rate confirmation with clear payment escrows and fast digital settlement upon delivery proof.',
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
              Operational Workflows Compared
            </h2>
          </div>
          <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#7a7168', fontSize: 14 }}>
            Dual-perspective architectural view
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
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#2b2420' }}>Shippers &amp; Brokers</h3>
                    <div style={{ fontSize: 12, color: '#7a7168' }}>Demand-side dispatch workflow</div>
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
                <span>⏱ Avg. time-to-cover reduced from 2.5 hrs to +14 mins</span>
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
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#2b2420' }}>Carriers &amp; Fleets</h3>
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
                <span>✅ Zero mystery middlemen &amp; direct shipper negotiations</span>
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
