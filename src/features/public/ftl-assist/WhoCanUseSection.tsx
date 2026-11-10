import Link from 'next/link';

const roles = [
  {
    icon: '🏠',
    title: 'Moving Companies',
    color: '#1e3a5f',
    isHighlighted: false,
    items: [
      'Post and manage your moves',
      'Find and coordinate carriers',
      'Handle bookings and follow-ups',
      'Manage job updates and closing sheets',
    ],
  },
  {
    icon: '🚛',
    title: 'Carriers',
    color: '#fc3f07',
    isHighlighted: true,
    items: [
      'Post available trailer capacity',
      'Find and book loads',
      'Coordinate with moving companies and brokers',
      'Manage driver and job updates',
    ],
  },
  {
    icon: '🤝',
    title: 'Moving Brokers',
    color: '#1e3a5f',
    isHighlighted: false,
    items: [
      'Find qualified moving companies to handle your jobs',
      'Find carriers directly when needed',
      'Coordinate rates and bookings',
      'Manage job updates and follow-ups',
    ],
  },
];

export default function WhoCanUseSection() {
  return (
    <section style={{ background: '#f8fafc', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
            Who Can Use FTL Assist?
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>
            FTL Assist is designed for all three sides of the household moving industry.
          </p>
        </div>

        {/* Role cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}
          className="ftl-assist-roles-grid"
        >
          {roles.map((role) => (
            <div
              key={role.title}
              style={{
                background: role.isHighlighted ? role.color : role.color,
                borderRadius: 16,
                padding: '28px 24px',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {role.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  {role.title}
                </h3>
              </div>

              {/* Checklist */}
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {role.items.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#ffffff', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Arrow button */}
              <Link
                href="/contact?subject=FTL+Assist+Request"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  fontSize: 16,
                  textDecoration: 'none',
                  marginTop: 20,
                  transition: 'background 0.2s',
                }}
              >
                →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ftl-assist-roles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
