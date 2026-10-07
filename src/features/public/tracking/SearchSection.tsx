'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { TrackingResult, TrackingStatus } from './types';
import { inTransitResult, deliveredResult, notPickedResult } from './mockData';

// Quick-pick samples shown below the search bar
const SAMPLES = [
  { id: 'FTL-9482-1LTX', label: 'FTL-9482-1LTX (In Transit)' },
  { id: 'FTL-8820-CHI',  label: 'FTL-8820-CHI (Delivered)' },
  { id: 'FTL-7710-ATL',  label: 'FTL-7710-ATL (Not Picked Up)' },
  { id: 'MW-55104-UNK',  label: 'MW-55104-UNK (Unknown)' },
];

interface Props {
  onResult: (result: TrackingResult | null, status: TrackingStatus) => void;
}

export default function SearchSection({ onResult }: Props) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-search if ?job_id= is present in the URL on mount
  useEffect(() => {
    const prefilledId = searchParams.get('job_id');
    if (prefilledId) {
      setQuery(prefilledId.toUpperCase());
      runSearch(prefilledId.toUpperCase());
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(jobId: string) {
    const id = jobId.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`https://movingwyze.com/api/tracking/search/?job_id=${encodeURIComponent(id)}`);
      if (res.status === 404 || res.status === 400) {
        onResult(null, 'not_found');
        return;
      }
      const json = await res.json();
      // Real API wraps data in { status, message, data: { task, loadsheet } }
      // Map to our TrackingResult shape using only the safe public fields
      const task = json?.data?.task;
      const loadsheet = json?.data?.loadsheet;
      if (!task) { onResult(null, 'not_found'); return; }
      const result: TrackingResult = {
        job_id:        task.job_id,
        status:        task.status,
        from_location: task.from_location,
        to_location:   task.to_location,
        driver_name:   loadsheet?.driver_name ?? 'Assigned driver',
        date:          loadsheet?.date ?? '',
      };
      onResult(result, result.status as TrackingStatus);
    } catch {
      // Network error — fall through to not_found
      onResult(null, 'not_found');
    } finally {
      setLoading(false);
    }
  }

  // Used by the quick-pick sample buttons
  function handleSample(id: string) {
    setQuery(id);
    // Dev-only mock responses while real API isn't wired
    if (id === 'FTL-9482-1LTX') { onResult(inTransitResult, 'in_transit'); return; }
    if (id === 'FTL-8820-CHI')  { onResult(deliveredResult,  'complete');   return; }
    if (id === 'FTL-7710-ATL')  { onResult(notPickedResult,  'not_picked'); return; }
    onResult(null, 'not_found');
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
          fontSize: 12, fontWeight: 600, color: '#d93506',
          marginBottom: 24,
        }}
      >
        🛰 PUBLIC SHIPMENT TRACKING
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 400, lineHeight: 1.2, color: '#1a1a1a',
          maxWidth: 640, marginBottom: 16,
        }}
      >
        Track your shipment.
        <br />
        <span style={{ fontStyle: 'italic', color: '#fc3f07' }}>No login required.</span>
      </h1>

      <p style={{ maxWidth: 520, color: '#6b7280', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Enter your Job ID to see the current status, route, and driver for your shipment.
        Your personal information is never exposed.
      </p>

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
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && runSearch(query)}
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
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => runSearch(query)}
            disabled={loading || !query.trim()}
            style={{
              background: loading ? '#e5a87a' : '#fc3f07',
              color: '#fff', fontWeight: 600, fontSize: 14,
              borderRadius: 12, padding: '12px 24px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: !query.trim() ? 0.6 : 1,
            }}
          >
            {loading ? 'Searching…' : 'Track Shipment →'}
          </button>
        </div>

        {/* Sample IDs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 12, padding: '0 4px' }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Try a sample:</span>
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSample(s.id)}
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
