'use client';

import { useState } from 'react';
import type { TrackingStatus, TrackingResult } from './types';
import SearchSection from './SearchSection';
import ResultCard from './ResultCard';
import MilestoneSection from './MilestoneSection';
import EquipmentSection from './EquipmentSection';
import NotFoundState from './NotFoundState';
import TrackingSupportBanner from './SupportBanner';

export default function TrackingPageClient() {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [status, setStatus] = useState<TrackingStatus>('idle');
  const [lastQuery, setLastQuery] = useState('');

  function handleResult(r: TrackingResult | null, s: TrackingStatus) {
    setResult(r);
    setStatus(s);
    if (r) setLastQuery(r.jobId);
  }

  return (
    <div style={{ background: '#fdf6ee', minHeight: '100vh' }}>
      <SearchSection onResult={handleResult} />

      {status === 'not_found' && <NotFoundState jobId={lastQuery} />}

      {result && (status === 'in_transit' || status === 'delivered') && (
        <>
          <ResultCard result={result} />
          <MilestoneSection result={result} />
          <EquipmentSection result={result} />
        </>
      )}

      <TrackingSupportBanner />
    </div>
  );
}
