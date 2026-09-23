export default function NotFoundState({ jobId }: { jobId: string }) {
  return (
    <section
      style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          background: '#fff', borderRadius: 24, padding: '48px 32px',
          textAlign: 'center', border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 8 }}>
          Job ID Not Found
        </h3>
        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 400, margin: '0 auto 8px' }}>
          No active or completed shipment record matches{' '}
          <code
            style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 13,
              background: '#f7ece0', padding: '2px 8px', borderRadius: 4, color: '#d93506',
            }}
          >
            {jobId}
          </code>
          .
        </p>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          Double-check the Job ID on your rate confirmation, or contact the shipper/broker for the correct reference.
        </p>
      </div>
    </section>
  );
}
