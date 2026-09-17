type MatrixRow =
  | { type: 'heading'; label: string }
  | { type: 'row'; label: string; tier1: string; tier2: string; tier1Green?: boolean; tier2Green?: boolean };

const rows: MatrixRow[] = [
  { type: 'heading', label: '1. LOAD POSTING & DISCOVERY' },
  { type: 'row', label: 'Spot Load Posting (Origin, Dest, Cu Ft)', tier1: '✓ Unlimited', tier2: '✓ Unlimited', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Reverse Capacity Broadcast (Return Space)', tier1: '✓ Included', tier2: '✓ Real-time Matching', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Equipment Specs & Demands', tier1: 'Basic Notes', tier2: 'Programmatic Rules' },
  { type: 'row', label: 'Visibility Controls (Public vs Private)', tier1: '—', tier2: '✓ Configurable', tier2Green: true },

  { type: 'heading', label: '2. DOT AUTHORITY & COMPLIANCE' },
  { type: 'row', label: 'Identity Verification', tier1: 'Basic Account', tier2: 'DOT/MC + COI Audit' },
  { type: 'row', label: 'Real-Time FMCSA SAFER Query', tier1: '—', tier2: '✓ Automated API', tier2Green: true },
  { type: 'row', label: '$1M Active Liability Policy Check', tier1: 'Manual', tier2: '✓ In-Platform', tier2Green: true },
  { type: 'row', label: 'Re-Brokering & Chameleon Carrier Shield', tier1: '—', tier2: '✓ Enforced', tier2Green: true },

  { type: 'heading', label: '3. BIDDING & RATE EXECUTION' },
  { type: 'row', label: 'Negotiation Medium', tier1: 'Phone & Email', tier2: 'Digital Counteroffers' },
  { type: 'row', label: 'Binding Rate Handshake & Job ID', tier1: '—', tier2: '✓ Auto Rate Con PDF', tier2Green: true },
  { type: 'row', label: 'Job-Scoped Encrypted Messaging', tier1: '—', tier2: '✓ Audit Trail', tier2Green: true },

  { type: 'heading', label: '4. TERMS & SETTLEMENT' },
  { type: 'row', label: 'Platform Subscription', tier1: '$0 Free', tier2: 'Volume Scaled' },
  { type: 'row', label: 'Broker Commission Skim', tier1: '0%', tier2: '0% Direct Pay', tier2Green: true },
];

export default function FeatureMatrix() {
  return (
    <section id="feature-matrix" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 40, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#c2622b', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
          ARCHITECTURAL MATRIX
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, color: '#1a1a1a', marginBottom: 8 }}>
          Deep Feature Breakdown
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
          Compare specific compliance, bidding, and settlement capabilities between operating tiers.
        </p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', fontWeight: 600, padding: '16px 24px', width: '50%', color: '#1a1a1a' }}>
                Capabilities &amp; Governance
              </th>
              <th style={{ textAlign: 'center', fontWeight: 600, padding: '16px 24px', color: '#1a1a1a' }}>
                Tier 1<br />
                <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>Community Bulletin</span>
              </th>
              <th style={{ textAlign: 'center', fontWeight: 600, padding: '16px 24px', background: '#fff7ed', color: '#1a1a1a' }}>
                ★ Tier 2<br />
                <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>Binding Marketplace</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              if (row.type === 'heading') {
                return (
                  <tr key={i} style={{ background: '#f9fafb' }}>
                    <td
                      colSpan={3}
                      style={{
                        padding: '8px 24px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#c2622b',
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      {row.label}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '14px 24px', color: '#374151' }}>{row.label}</td>
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '14px 24px',
                      fontWeight: row.tier1Green ? 500 : 400,
                      color: row.tier1 === '—' ? '#d1d5db' : row.tier1Green ? '#16a34a' : '#6b7280',
                    }}
                  >
                    {row.tier1}
                  </td>
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '14px 24px',
                      background: 'rgba(255,247,237,0.5)',
                      fontWeight: row.tier2Green ? 500 : 400,
                      color: row.tier2 === '—' ? '#d1d5db' : row.tier2Green ? '#16a34a' : '#374151',
                    }}
                  >
                    {row.tier2}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
