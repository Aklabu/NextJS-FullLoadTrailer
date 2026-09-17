import type { TrackingResult } from './types';

interface Props {
  result: TrackingResult;
}

export default function ResultCard({ result }: Props) {
  const isDelivered = result.status === 'delivered';

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        {/* Top bar */}
        <div style={{ height: 6, background: 'linear-gradient(to right, #d97b3f, #c2622b)' }} />

        <div style={{ padding: '32px' }}>
          {/* Job header */}
          <div
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 600,
                    background: '#f3f4f6', borderRadius: 999, padding: '6px 12px', color: '#374151',
                  }}
                >
                  JOB #{result.jobId}
                </span>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600, color: isDelivered ? '#15803d' : '#c2622b',
                    background: isDelivered ? '#dcfce7' : '#fff7ed',
                    borderRadius: 999, padding: '6px 12px',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDelivered ? '#22c55e' : '#c2622b', display: 'inline-block' }} />
                  {isDelivered ? 'DELIVERED' : 'IN TRANSIT'}
                </span>
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#1a1a1a' }}>{result.routeName}</h2>
            </div>

            <div style={{ textAlign: 'right', fontSize: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, color: '#4b5563', marginBottom: 4 }}>
                📍 Last GPS Telemetry: <strong>{result.lastPing}</strong>
              </div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                Corridor Waypoint: {result.waypoint}
              </div>
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 11,
                  background: '#f3f4f6', borderRadius: 999, padding: '4px 12px', color: '#6b7280',
                }}
              >
                Verified Telemetry • GET /api/tracking/search/?job_id={result.jobId}
              </span>
            </div>
          </div>

          {/* Route summary */}
          <div style={{ background: '#f7ece0', borderRadius: 16, padding: '28px' }}>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}
              className="tracking-route-grid"
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
                  ORIGIN LOGISTICS CORRIDOR
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1a1a1a', marginBottom: 4 }}>{result.origin}</div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#6b7280' }}>{result.originCode}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
                  DESTINATION LOGISTICS CORRIDOR
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1a1a1a', marginBottom: 4 }}>{result.destination}</div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#6b7280' }}>{result.destinationCode}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
                  TOTAL DISTANCE &amp; TARGET ETA
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#c2622b', marginBottom: 4 }}>
                  {result.distance} • {result.eta}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{result.scheduleNote}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ position: 'relative', paddingBottom: 32 }}>
              <div style={{ position: 'relative', height: 6, background: '#e5e7eb', borderRadius: 999 }}>
                {/* Filled portion */}
                <div
                  style={{
                    position: 'absolute', left: 0, top: 0, height: 6,
                    width: `${result.progressPercent}%`,
                    background: '#d97b3f', borderRadius: 999,
                  }}
                />
                {/* Start dot */}
                <div
                  style={{
                    position: 'absolute', left: -4, top: -5,
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#d97b3f', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9,
                  }}
                >
                  ✓
                </div>
                {/* Truck or flag at progress */}
                {!isDelivered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: `calc(${result.progressPercent}% - 12px)`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#d97b3f', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      }}
                    >
                      🚚
                    </div>
                    <span
                      style={{
                        marginTop: 8,
                        fontFamily: 'ui-monospace, monospace', fontSize: 10,
                        background: '#fff', border: '1px solid #e5e7eb',
                        borderRadius: 999, padding: '2px 8px',
                        whiteSpace: 'nowrap', color: '#374151',
                      }}
                    >
                      {result.progressLabel}
                    </span>
                  </div>
                )}
                {/* End flag */}
                <div
                  style={{
                    position: 'absolute', right: -4, top: -5,
                    width: 16, height: 16, borderRadius: '50%',
                    background: isDelivered ? '#d97b3f' : '#e5e7eb',
                    color: isDelivered ? '#fff' : '#6b7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9,
                  }}
                >
                  🏁
                </div>
              </div>
              <div
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginTop: 8,
                  fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#6b7280',
                }}
              >
                <span>ORD (0 mi)</span>
                <span>DFW ({result.distance})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
