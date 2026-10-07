'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchTracking, TrackingApiError, type TrackingData } from '@/features/public/api/trackingApi';
import type { TrackingPageStatus } from './types';

interface Props {
  onResult: (result: TrackingData | null, status: TrackingPageStatus, errorMsg?: string) => void;
}

export default function SearchSection({ onResult }: Props) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-search if ?job_id= is present in the URL on mount
  useEffect(() => {
    const prefilledId = searchParams.get('job_id');
    if (prefilledId) {
      const id = prefilledId.toUpperCase();
      setQuery(id);
      runSearch(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(jobId: string) {
    const id = jobId.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    onResult(null, 'loading');
    try {
      const data = await searchTracking(id);
      onResult(data, 'found');
    } catch (err) {
      if (err instanceof TrackingApiError) {
        if (err.kind === 'not_found') {
          onResult(null, 'not_found');
        } else {
          // unavailable / unknown / invalid — show error message
          onResult(null, 'error', err.message);
        }
      } else {
        onResult(null, 'error', 'Unable to connect. Check your internet and try again.');
      }
    } finally {
      setLoading(false);
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
            <span style={{ color: '#9ca3af', fontSize: 16 }} aria-hidden="true">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase().slice(0, 15))}
              onKeyDown={(e) => e.key === 'Enter' && runSearch(query)}
              placeholder="Enter Job ID e.g. FTL-9482-1LTX"
              maxLength={15}
              aria-label="Job ID"
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
                onClick={() => { setQuery(''); onResult(null, 'idle'); }}
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
      </div>
    </header>
  );
}
