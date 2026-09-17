import type { TrackingResult } from './types';

interface Props {
  result: TrackingResult;
}

export default function MilestoneSection({ result }: Props) {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 24 }}>
        Milestone Telemetry Sequence
      </h2>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}
        className="tracking-milestones-grid"
      >
        {result.milestones.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.active ? '#fff7ed' : '#fff',
              borderRadius: 16,
              padding: 24,
              border: m.active ? '1px solid #fed7aa' : '1px solid #f3f4f6',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: m.active ? '#d97b3f' : '#f3f4f6',
                  color: m.active ? '#fff' : '#6b7280',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}
              >
                {m.icon}
              </div>
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 11,
                  color: m.active ? '#c2622b' : '#9ca3af',
                  fontWeight: m.active ? 600 : 400,
                }}
              >
                {m.timestamp}
              </span>
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, color: m.active ? '#1a1a1a' : '#374151', marginBottom: 8 }}>
              {m.title}
            </h3>
            <p style={{ fontSize: 13, color: m.active ? '#4b5563' : '#6b7280', lineHeight: 1.6 }}>
              {m.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
