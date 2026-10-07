'use client';

import { useState, Suspense } from 'react';
import type { TrackingResult, TrackingStatus } from './types';
import SearchSection from './SearchSection';
import ResultCard from './ResultCard';
import MilestoneSection from './MilestoneSection';
import NotFoundState from './NotFoundState';
import TrackingSupportBanner from './SupportBanner';

// Inner component uses useSearchParams via SearchSection — must be inside Suspense
function TrackingContent() {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [status, setStatus] = useState<TrackingStatus>('idle');
  const [lastQuery, setLastQuery] = useState('');

  function handleResult(r: TrackingResult | null, s: TrackingStatus) {
    setResult(r);
    setStatus(s);
    if (r) setLastQuery(r.job_id);
  }

  return (
    <div style={{ background: '#fdf6ee', minHeight: '100vh' }}>
      <SearchSection onResult={handleResult} />

      {status === 'not_found' && <NotFoundState jobId={lastQuery} />}

      {result && (status === 'in_transit' || status === 'complete' || status === 'not_picked') && (
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
