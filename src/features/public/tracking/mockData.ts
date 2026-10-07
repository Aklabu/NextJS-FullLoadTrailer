import type { TrackingResult } from './types';

// Sample response for a load currently in transit
export const inTransitResult: TrackingResult = {
  job_id: 'FTL-9482-1LTX',
  status: 'in_transit',
  from_location: 'Chicago, IL',
  to_location: 'Dallas, TX',
  driver_name: 'Marcus Webb',
  date: '2026-10-07',
};

// Sample response for a completed delivery
export const deliveredResult: TrackingResult = {
  job_id: 'FTL-8820-CHI',
  status: 'complete',
  from_location: 'Chicago, IL',
  to_location: 'Houston, TX',
  driver_name: 'Sandra Reyes',
  date: '2026-10-05',
};

// Sample response for a booked but not yet picked up load
export const notPickedResult: TrackingResult = {
  job_id: 'FTL-7710-ATL',
  status: 'not_picked',
  from_location: 'Atlanta, GA',
  to_location: 'Nashville, TN',
  driver_name: 'James Okoro',
  date: '2026-10-09',
};
