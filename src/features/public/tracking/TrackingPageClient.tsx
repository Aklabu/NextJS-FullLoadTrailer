'use client';

import { useState, Suspense } from 'react';
import type { TrackingResult, TrackingPageStatus } from './types';
import SearchSection from './SearchSection';
import ResultCard from './ResultCard';
import MilestoneSection from './MilestoneSection';
import NotFoundState from './NotFoundState';
import TrackingSupportBanner from './SupportBanner';

// Inner component uses useSearchParams via SearchSection — must be inside Suspense
function TrackingContent() {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [pageStatus, setPageStatus] = useState<TrackingPageStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [lastQuery, setLastQuery] = useState('');

  function handleResult(r: TrackingResult | null, s: TrackingPageStatus, msg?: string) {
    setResult(r);
    setPageStatus(s);
    setErrorMsg(msg ?? '');
    if (r) setLastQuery(r.job_id);
  }

  return (
    <div style={{ background: '#fdf6ee', minHeight: '100vh' }}>
      <SearchSection onResult={handleResult} />

      {/* Error state — service unavailable or network failure */}
      {pageStatus === 'error' && (
        <div
          style={{
            maxWidth: 600, margin: '0 auto 40px', padding: '0 24px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              background: '#fff', border: '1px solid #fecaca',
              borderRadius: 16, padding: '20px 24px',
            }}
          >
            <span style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true">⚠️</span>
            <div>
              <p style={{ fontWeight: 600, color: '#991b1b', marginBottom: 4, fontSize: 14 }}>
                Tracking unavailable
              </p>
              <p style={{ color: '#7f1d1d', fontSize: 13, lineHeight: 1.5 }}>
                {errorMsg || 'An error occurred. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {pageStatus === 'not_found' && <NotFoundState jobId={lastQuery} />}

      {result && pageStatus === 'found' && (
        <>
          <ResultCard result={result} />
          <MilestoneSection result={result} />
        </>
      )}

      <TrackingSupportBanner />
    </div>
  );
}

// Suspense boundary required because SearchSection reads useSearchParams on mount
export default function TrackingPageClient() {
  return (
    <Suspense fallback={<div style={{ background: '#fdf6ee', minHeight: '100vh' }} />}>
      <TrackingContent />
    </Suspense>
  );
}
