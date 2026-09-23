import Link from 'next/link';

export default function TrackingSupportBanner() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div
        style={{
          background: '#f7ece0', borderRadius: 24, padding: '32px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
        }}
        className="tracking-support-inner"
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 12,
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0, color: '#d93506',
            }}
          >
            🎧
          </div>
          <div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1a1a1a', marginBottom: 4 }}>
              24/7 Operations Desk &amp; Gate Logistics Support
            </h3>
            <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 520, lineHeight: 1.6 }}>
              Dispatch coordinates directly with origin/receiver gate guards and line-haul dispatchers. Direct API queries available via{' '}
              <code style={{ background: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                POST /support/contact/
              </code>{' '}
              or phone hotline.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
          <a
            href="tel:8005555623"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1px solid #e5e7eb',
              color: '#1a1a1a', fontSize: 14, fontWeight: 600,
              borderRadius: 999, padding: '12px 20px',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            📞 (800) 555-LOAD
          </a>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fc3f07', color: '#fff',
              fontSize: 14, fontWeight: 600,
              borderRadius: 999, padding: '12px 20px',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            📍 Open Live Gate Dispatch Ticket
          </Link>
        </div>
      </div>
    </section>
  );
}
