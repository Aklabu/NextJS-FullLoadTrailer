import type { TrackingResult } from './types';

interface Props {
  result: TrackingResult;
}

// Status display config — label, colours, icon
const STATUS_CONFIG = {
  in_transit:  { label: 'IN TRANSIT',    bg: '#fff7ed', color: '#d93506', dot: '#fc3f07', icon: '🚚' },
  complete:    { label: 'DELIVERED',     bg: '#dcfce7', color: '#15803d', dot: '#22c55e', icon: '✅' },
  not_picked:  { label: 'NOT PICKED UP', bg: '#e0f2fe', color: '#0369a1', dot: '#38bdf8', icon: '📦' },
} as const;

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ResultCard({ result }: Props) {
  const cfg = STATUS_CONFIG[result.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.in_transit;

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 40px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        {/* Brand top bar */}
        <div style={{ height: 6, background: 'linear-gradient(to right, #fc3f07, #d93506)' }} />

        <div style={{ padding: '32px' }}>
          {/* Job ID + status row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <span
              style={{
                fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 600,
                background: '#f3f4f6', borderRadius: 999, padding: '6px 14px', color: '#374151',
              }}
            >
              JOB #{result.job_id}
            </span>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700,
                color: cfg.color, background: cfg.bg,
                borderRadius: 999, padding: '6px 14px',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
              {cfg.icon} {cfg.label}
            </span>
          </div>

          {/* Route */}
          <div
            style={{
              background: '#f7ece0', borderRadius: 16, padding: '28px',
              display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16,
            }}
            className="tracking-route-grid"
          >
            {/* From */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                FROM
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1a1a1a', marginBottom: 4 }}>
                {result.from_location}
              </p>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fc3f07' }}>
              →
            </div>

            {/* To */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                TO
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1a1a1a', marginBottom: 4 }}>
                {result.to_location}
              </p>
            </div>
          </div>

          {/* Driver + date row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 24 }}>
            <div style={{ background: '#fafaf8', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 180 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                ASSIGNED DRIVER
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                {result.driver_name}
              </p>
            </div>
            <div style={{ background: '#fafaf8', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 180 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                SCHEDULED DATE
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                {formatDate(result.scheduled_date)}
              </p>
            </div>
          </div>

          {/* Privacy note */}
          <p style={{ marginTop: 20, fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 6 }}>
            🔒 No personal or financial information is exposed on this page.
          </p>
        </div>
      </div>
    </section>
  );
}
