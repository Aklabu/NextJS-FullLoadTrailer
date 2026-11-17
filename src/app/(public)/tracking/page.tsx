import type { Metadata } from 'next';
import '@/features/public/tracking/tracking.css';
import { TrackingPageClient } from '@/features/public/tracking';

export const metadata: Metadata = {
  title: 'Track Shipment — FullTrailerLoad',
  description:
    'Track active and completed household moves by Job ID. Real-time corridor updates with zero login required and no customer PII exposed.',
};

export default function TrackingPage() {
  return <TrackingPageClient />;
}
