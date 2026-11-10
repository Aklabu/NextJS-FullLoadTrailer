const checks = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12l2 2 4-4" /><path d="M7 20v-2a2 2 0 012-2h6a2 2 0 012 2v2" />
      </svg>
    ),
    title: 'Moving Industry Compliance',
    body: 'We verify household goods operating authority and related requirements for your role and operations.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Role-Specific Review',
    body: 'We review requirements for moving companies, brokers, and motor carriers with household goods experience.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'Industry Risk Signals',
    body: 'We check for inconsistent business details, unauthorized brokering, and other moving-specific risk indicators.',
  },
];

export default function ExtraChecksSection() {
  return (
    <section style={{ background: '#eff6ff', padding: '64px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Header */}
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#1e2d4a',
            textAlign: 'center',
            marginBottom: 36,
          }}
        >
          Extra Checks for the Moving Industry
        </h2>

        {/* 3-column cards */}
        <div
          className="ts-checks-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
        >
          {checks.map((c) => (
            <div
              key={c.title}
              style={{
                background: '#ffffff',
                borderRadius: 12,
                padding: '24px 22px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  background: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e2d4a', margin: '0 0 8px' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ts-checks-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
