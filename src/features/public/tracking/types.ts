// Re-export API types so tracking UI components import from one place
export type { TrackingData as TrackingResult, TrackingErrorKind } from '@/features/public/api/trackingApi';

// UI state for the tracking page
export type TrackingPageStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'error';
