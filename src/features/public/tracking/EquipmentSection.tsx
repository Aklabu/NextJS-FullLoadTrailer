import type { TrackingResult } from './types';

interface Props {
  result: TrackingResult;
}

export default function EquipmentSection({ result }: Props) {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, color: '#1a1a1a' }}>
          Equipment &amp; Carrier Telemetry
        </h2>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
          🔓 Privacy Enforced (Zero PII Exposed)
        </span>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
        className="tracking-equipment-grid"
      >
        {result.equipment.map((f, i) => (
          <div key={i} style={{ background: '#f7ece0', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
              {f.label}
            </div>
            <div
              style={{
                fontFamily: f.mono ? 'ui-monospace, monospace' : 'Georgia, serif',
                fontSize: f.mono ? 15 : 17,
                color: f.mono ? '#d93506' : '#1a1a1a',
                marginBottom: 4,
                fontWeight: f.mono ? 600 : 400,
              }}
            >
              {f.value}
            </div>
            <p style={{ fontSize: 12, color: '#6b7280' }}>{f.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
