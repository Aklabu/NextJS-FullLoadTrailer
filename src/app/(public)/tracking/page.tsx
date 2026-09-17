import type { Metadata } from 'next';
import '@/features/public/tracking/tracking.css';
import { TrackingPageClient } from '@/features/public/tracking';

export const metadata: Metadata = {
  title: 'Track Shipment — FullLoadTrailer',
  description:
    'Track active and completed freight shipments by Job ID. Real-time corridor telemetry with zero login required and no customer PII exposed.',
};

export default function TrackingPage() {
  return <TrackingPageClient />;
}
