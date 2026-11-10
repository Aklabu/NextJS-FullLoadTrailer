const steps = [
  {
    number: '1',
    icon: '📝',
    title: 'Tell Us Your Needs',
    body: 'Share your business details and what you want our team to handle.',
  },
  {
    number: '2',
    icon: '👥',
    title: 'We Set Up Your Account',
    body: 'Our team prepares your profile, postings, and the tools you need.',
  },
  {
    number: '3',
    icon: '💻',
    title: 'We Manage the Work',
    body: 'We post loads, find the right partners, coordinate bookings, and keep your jobs updated.',
  },
  {
    number: '4',
    icon: '🚚',
    title: 'You Stay in Control',
    body: 'You receive regular updates and confirmations while we handle the day-to-day work.',
  },
];

export default function HowItWorksSection() {
  return (
    <section style={{ background: '#f8fafc', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            How It Works
          </h2>
        </div>

        {/* Steps row */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, alignItems: 'start' }}
          className="ftl-assist-steps-grid"
        >
          {steps.map((step, i) => (
            <div key={step.number} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              {/* Step card */}
              <div style={{ flex: 1, textAlign: 'center', padding: '0 16px', position: 'relative' }}>
                {/* Number badge */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#fc3f07',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  {step.number}
                </div>
                {/* Icon */}
                <div style={{ fontSize: 32, marginBottom: 12 }}>{step.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{step.body}</p>
              </div>

              {/* Arrow connector (not after last) */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    color: '#cbd5e1',
                    fontSize: 22,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 24,
                    alignSelf: 'flex-start',
                  }}
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ftl-assist-steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .ftl-assist-steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
