'use client';

const services = [
  {
    icon: '👤',
    title: 'Account Setup & Profile Management',
    body: 'We create and manage your company profile, business details, and account settings.',
  },
  {
    icon: '📋',
    title: 'Load Posting & Management',
    body: 'We post your loads, update details, and keep your listings active and visible.',
  },
  {
    icon: '🤝',
    title: 'Partner Sourcing & Coordination',
    body: 'We find and connect you with qualified moving companies, carriers, or other partners based on your needs.',
  },
  {
    icon: '📅',
    title: 'Booking & Follow-Up',
    body: 'We coordinate bookings, confirm details, and follow up with all parties to keep things on track.',
  },
  {
    icon: '🚚',
    title: 'Job Updates & Delivery Coordination',
    body: 'We keep job information organized, provide updates, and help manage delivery and closing details.',
  },
];

export default function WhatWeDoSection() {
  return (
    <section style={{ background: '#ffffff', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ height: 2, width: 48, background: '#fc3f07', borderRadius: 999 }} />
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 32,
                fontWeight: 700,
                color: '#1a1a2e',
                margin: 0,
              }}
            >
              What Our Team Does for You
            </h2>
            <div style={{ height: 2, width: 48, background: '#fc3f07', borderRadius: 999 }} />
          </div>
        </div>

        {/* Service cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 20,
          }}
          className="ftl-assist-services-grid"
        >
          {services.map((s) => (
            <div
              key={s.title}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '28px 20px',
                textAlign: 'center',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#e8f4fd',
                  border: '2px solid #224248',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  margin: '0 auto 16px',
                }}
              >
                {s.icon}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 10, lineHeight: 1.4 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .ftl-assist-services-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .ftl-assist-services-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
