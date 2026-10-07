// Status values returned by GET /api/tracking/search/?job_id=
export type TrackingStatus = 'not_picked' | 'in_transit' | 'complete' | 'not_found' | 'idle';

// Minimal safe fields returned by the public tracking endpoint
export interface TrackingResult {
  job_id: string;
  status: TrackingStatus;
  from_location: string;
  to_location: string;
  driver_name: string;
  date: string; // ISO date string e.g. "2026-10-07"
}
