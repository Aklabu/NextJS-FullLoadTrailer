const items = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fc3f07" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /><path d="M6 8h.01M6 11h.01M6 14h.01" />
      </svg>
    ),
    title: 'Continuous Monitoring',
    body: 'We may review accounts for changes, complaints, or unusual activity.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fc3f07" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
      </svg>
    ),
    title: 'Addressing Member Reports',
    body: 'We take member reports seriously and may request additional information or action.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fc3f07" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: 'Account Accountability',
    body: 'Accounts that violate our platform policies may be restricted or removed.',
  },
];

export default function OngoingSafetySection() {
  return (
    <section style={{ background: '#ffffff', padding: '64px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 36 }}>
          <div style={{ height: 2, width: 48, background: '#fc3f07', borderRadius: 999 }} />
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1e2d4a', margin: 0 }}>
            Ongoing Platform Safety
          </h2>
          <div style={{ height: 2, width: 48, background: '#fc3f07', borderRadius: 999 }} />
        </div>

        {/* 3-column */}
        <div
          className="ts-safety-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 28 }}
        >
          {items.map((item) => (
            <div
              key={item.title}
              style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: '#fff7f5',
                  border: '1.5px solid #fcd9cc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e2d4a', margin: '0 0 8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '14px 20px',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 16, flexShrink: 0, marginTop: 1 }}>ℹ</span>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
            Verification reduces risk but does not guarantee the performance, financial standing, or legitimacy of every member or transaction.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ts-safety-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
