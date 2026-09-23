const methods = [
  {
    icon: '📞',
    label: '24/7 OPERATIONS DESK',
    value: '(800) 555-LOAD',
    description:
      'Standard Ops: Mon–Fri 6am–8pm CST. Dedicated emergency dispatch & breakdown lines open 24/7/365.',
    badge: 'Priority 1',
  },
  {
    icon: '@',
    label: 'OPERATIONAL LOGISTICS',
    value: 'support@fulltrailerload.com',
    description:
      'Guaranteed ticketing response within 2 business hours. Routing directly to freight resolution specialists.',
    badge: '‹ 2h SLA',
  },
  {
    icon: '🔗',
    label: 'CENTRAL FREIGHT CORRIDOR',
    value: 'Chicago, IL (Midwest Hub)',
    description:
      'Physical operations control room & compliance hub. Carrier vetting and regional escort coordination center.',
    badge: 'Central Hub',
  },
];

export default function ContactMethods() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
      <div style={{ background: '#f7ece0', borderRadius: 24, padding: '40px' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          className="contact-methods-grid"
        >
          {methods.map((m) => (
            <div
              key={m.label}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 28,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              <div
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: '#fff7ed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, marginBottom: 24, color: '#d93506',
                }}
              >
                {m.icon}
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' }}>
                {m.label}
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1a1a1a', marginBottom: 12, wordBreak: 'break-word' }}>
                {m.value}
              </div>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 24 }}>
                {m.description}
              </p>
              <span
                style={{
                  fontSize: 11, fontWeight: 600,
                  background: '#f3f4f6', color: '#4b5563',
                  borderRadius: 999, padding: '4px 12px',
                }}
              >
                {m.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
