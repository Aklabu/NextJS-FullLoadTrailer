type MatrixRow =
  | { type: 'heading'; label: string }
  | { type: 'row'; label: string; tier1: string; tier2: string; tier1Green?: boolean; tier2Green?: boolean };

const rows: MatrixRow[] = [
  { type: 'heading', label: '1. COMMUNITY & COMMUNICATION' },
  { type: 'row', label: 'One main community (industry-wide)', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Real-time chat', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Reply to posts', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Private messaging', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Share photos and documents', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Notifications', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Multiple groups', tier1: '—', tier2: '—' },

  { type: 'heading', label: '2. LOAD POSTING & DISCOVERY' },
  { type: 'row', label: 'Post loads and available trucks', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Ask questions and share info', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Search and filter by category', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Structured load listings', tier1: '—', tier2: '✓', tier2Green: true },
  { type: 'row', label: 'Carrier / mover matching', tier1: '—', tier2: '✓', tier2Green: true },

  { type: 'heading', label: '3. VERIFICATION & COMPLIANCE' },
  { type: 'row', label: 'Basic member screening', tier1: '✓', tier2: '✓', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'DOT / MC information (required)', tier1: '✓ Basic', tier2: '✓ Full verification', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'COI (certificate of insurance)', tier1: '✓ Basic / required', tier2: '✓ Verified', tier1Green: true, tier2Green: true },
  { type: 'row', label: 'Advanced verification', tier1: '—', tier2: '✓', tier2Green: true },
  { type: 'row', label: 'Third-party verification', tier1: '—', tier2: '✓', tier2Green: true },

  { type: 'heading', label: '4. MARKETPLACE FEATURES' },
  { type: 'row', label: 'Bidding', tier1: '—', tier2: '✓', tier2Green: true },
  { type: 'row', label: 'Booking', tier1: '—', tier2: '✓', tier2Green: true },
  { type: 'row', label: 'Transactions', tier1: '—', tier2: '✓', tier2Green: true },
  { type: 'row', label: 'Closing sheet', tier1: '—', tier2: '✓', tier2Green: true },
  { type: 'row', label: 'Document management', tier1: '—', tier2: '✓', tier2Green: true },
  { type: 'row', label: 'Shipment tracking', tier1: '—', tier2: '✓', tier2Green: true },
];

export default function FeatureMatrix() {
  return (
    <section id="feature-matrix" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 40, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#d93506', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
          TIER COMPARISON
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, color: '#1a1a1a', marginBottom: 8 }}>
          Full Feature Breakdown
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
          Compare community, verification, and marketplace capabilities between tiers.
        </p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', fontWeight: 600, padding: '16px 24px', width: '50%', color: '#1a1a1a' }}>
                Feature
              </th>
              <th style={{ textAlign: 'center', fontWeight: 600, padding: '16px 24px', color: '#1a1a1a' }}>
                Tier 1<br />
                <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>Community</span>
              </th>
              <th style={{ textAlign: 'center', fontWeight: 600, padding: '16px 24px', background: '#fff7ed', color: '#1a1a1a' }}>
                ★ Tier 2<br />
                <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>Marketplace</span>
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
                        color: '#d93506',
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
