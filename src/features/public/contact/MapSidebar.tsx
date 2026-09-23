export default function MapSidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Map card */}
      <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        {/* Map placeholder */}
        <div style={{ position: 'relative', height: 256, background: '#dbeafe', overflow: 'hidden' }}>
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.10), transparent)',
            }}
          />

          {/* Top label */}
          <div
            style={{
              position: 'absolute', top: 12, left: 12,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)',
              fontSize: 12, fontWeight: 500,
              padding: '6px 12px', borderRadius: 999,
              color: '#374151',
            }}
          >
            📍 Chicago Metro Logistics Terminal • ORD Hub, Zone 1
          </div>

          {/* Center pin */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 36 }}>📍</span>
            <span
              style={{
                background: '#fff', fontSize: 11, fontWeight: 600,
                padding: '4px 8px', borderRadius: 6,
                boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                color: '#374151',
              }}
            >
              Metro Logistics
            </span>
          </div>

          {/* Bottom label */}
          <div
            style={{
              position: 'absolute', bottom: 12, left: 12,
              fontFamily: 'Georgia, serif', fontSize: 17,
              color: '#fff',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            Chicago Operations Terminal
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
            Our specialized desks handle carrier credential validation, programmatic rate confirmations, and real-time transit telemetry 24 hours a day.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4, letterSpacing: 0.5, textTransform: 'uppercase' }}>COI CLEAR TIME</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1a1a1a' }}>‹ 20 Mins</div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4, letterSpacing: 0.5, textTransform: 'uppercase' }}>ON-TIME DISPATCH</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1a1a1a' }}>99.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation card */}
      <div style={{ background: '#f7ece0', borderRadius: 24, padding: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0, color: '#d93506',
            }}
          >
            📍
          </div>
          <div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1a1a1a', marginBottom: 2 }}>
              Urgent Transit Escalations
            </h3>
            <p style={{ fontSize: 12, color: '#6b7280' }}>Driver roadside or loading dock hold?</p>
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 20 }}>
          If your shipment is currently detained at a facility gate or experiencing a roadside emergency, bypass standard ticketing by dialing the direct emergency line with your active Load ID.
        </p>

        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fff', borderRadius: 12, padding: '12px 16px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
            🔒 Direct Escrow &amp; Gate Line
          </span>
          <span style={{ color: '#d93506', fontWeight: 600, fontSize: 14 }}>(800) 555-0199</span>
        </div>
      </div>
    </div>
  );
}
