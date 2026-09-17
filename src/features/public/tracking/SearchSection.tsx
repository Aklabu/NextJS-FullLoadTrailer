'use client';

import { useState } from 'react';
import type { TrackingStatus, TrackingResult } from './types';
import { inTransitResult, deliveredResult } from './mockData';

const SAMPLES = [
  { id: 'FTL-9482-1LTX', label: 'FTL-9482-1LTX (In Transit)' },
  { id: 'FTL-8820-CHI', label: 'FTL-8820-CHI (Delivered)' },
  { id: 'MW-55104-UNK', label: 'MW-55104-UNK (Unknown ID)' },
];

interface Props {
  onResult: (result: TrackingResult | null, status: TrackingStatus) => void;
}

export default function SearchSection({ onResult }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch(id?: string) {
    const jobId = (id ?? query).trim().toUpperCase();
    if (!jobId) return;
    setLoading(true);
    // TODO: GET /api/tracking/search/?job_id=...
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    if (jobId === 'FTL-9482-1LTX') {
      onResult(inTransitResult, 'in_transit');
    } else if (jobId === 'FTL-8820-CHI') {
      onResult(deliveredResult, 'delivered');
    } else {
      onResult(null, 'not_found');
    }
  }

  return (
    <header
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '56px 24px 40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#fff', border: '1px solid #fed7aa',
          borderRadius: 999, padding: '6px 16px',
          fontSize: 12, fontWeight: 600, color: '#c2622b',
          marginBottom: 24,
        }}
      >
        🛰 PUBLIC FREIGHT TELEMETRY &amp; TRACKING
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 400, lineHeight: 1.2, color: '#1a1a1a',
          maxWidth: 640, marginBottom: 24,
        }}
      >
        Track Shipment by Job ID.
        <br />
        <span style={{ fontStyle: 'italic', color: '#d97b3f' }}>Real-Time Corridor Telemetry.</span>
      </h1>

      <p style={{ maxWidth: 560, color: '#6b7280', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
        Instant dispatch status and milestone checkpoints for active and completed freight corridors. Zero login required, built privacy-first with zero customer PII exposed.
      </p>

      {/* Feature flags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', fontSize: 14, color: '#4b5563', marginBottom: 40 }}>
        <span>✅ MovingWyze Compatible API</span>
        <span>🔀 Live Corridor Ping Telemetry</span>
        <span>🔒 100% Cryptographic Job ID Validation</span>
      </div>

      {/* Search bar */}
      <div
        style={{
          background: '#fff', borderRadius: 16,
          padding: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 12,
              background: '#f7ece0', borderRadius: 12, padding: '12px 16px',
              minWidth: 200,
            }}
          >
            <span style={{ color: '#9ca3af', fontSize: 16 }}>🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Job ID e.g. FTL-9482-1LTX"
              style={{
                flex: 1, background: 'transparent',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 14, fontWeight: 500,
                border: 'none', outline: 'none', color: '#1a1a1a',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={loading}
            style={{
              background: loading ? '#e5a87a' : '#d97b3f',
              color: '#fff', fontWeight: 600, fontSize: 14,
              borderRadius: 12, padding: '12px 24px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {loading ? 'Searching…' : 'Track Shipment →'}
          </button>
        </div>

        {/* Sample IDs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 12, padding: '0 4px' }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Quick Sample Jobs:</span>
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setQuery(s.id); handleSearch(s.id); }}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12, background: '#f7ece0', border: 'none',
                borderRadius: 999, padding: '6px 12px',
                cursor: 'pointer', color: '#374151',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
