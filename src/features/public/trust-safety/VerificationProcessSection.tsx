const steps = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Business Identity Verification',
    body: 'We review your registration details and verify company records, including USDOT and MC numbers, legal name, and contact information.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Operating Authority & Insurance Check',
    body: 'We confirm active operating authority and insurance coverage using FMCSA records and other trusted sources.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Household Goods Credentials',
    body: 'We review household goods-specific authority and broker registration (when applicable) to ensure you\'re properly qualified for moving operations.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v3M11 14h.01" />
      </svg>
    ),
    title: 'Fraud & Risk Screening',
    body: 'We look for red flags such as identity mismatch, unauthorized brokering, suspicious activity, and inconsistent information.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Review Before Approval',
    body: 'Every application is reviewed by our team. Access is granted only after verification is complete, and may be delayed or declined if concerns remain.',
  },
];

export default function VerificationProcessSection() {
  return (
    <section style={{ background: '#ffffff', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 0 }}>
            <div style={{ height: 2, width: 48, background: '#fc3f07', borderRadius: 999 }} />
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1e2d4a', margin: 0 }}>
              Our Verification Process
            </h2>
            <div style={{ height: 2, width: 48, background: '#fc3f07', borderRadius: 999 }} />
          </div>
        </div>

        {/* 5-column cards */}
        <div
          className="ts-verify-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}
        >
          {steps.map((s) => (
            <div
              key={s.title}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '28px 18px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#eff6ff',
                  border: '2px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e2d4a', margin: 0, lineHeight: 1.4 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .ts-verify-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .ts-verify-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
