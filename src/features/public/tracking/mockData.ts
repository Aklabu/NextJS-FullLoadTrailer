import type { TrackingResult } from './types';

export const inTransitResult: TrackingResult = {
  jobId: 'FTL-9482-1LTX',
  status: 'in_transit',
  routeName: 'Midwest-Southwest Trunkline',
  lastPing: '12 mins ago',
  waypoint: 'I-80 W near Des Moines, IA',
  origin: 'Chicago Metro Logistics Terminal, IL',
  originCode: 'ORD Hub • Zone 1 Midwest',
  destination: 'Dallas-Fort Worth Freight Depot, TX',
  destinationCode: 'DFW Hub • Inland Logistics Port',
  distance: '924 mi',
  eta: 'Tomorrow by 14:00 CST',
  scheduleNote: 'On Schedule (600 mi completed / 324 mi remaining)',
  progressPercent: 65,
  progressLabel: 'Mile 600',
  milestones: [
    { icon: '✓', timestamp: 'Oct 22 • 08:30', title: 'Dispatched & Tender Locked', description: 'Bill of Lading authenticated. Equipment verified on SAFER registry.' },
    { icon: '✓', timestamp: 'Oct 22 • 13:15', title: 'Departed Chicago Hub', description: 'Outbound gate checkpoint cleared. Bolt seal inspection verified.' },
    { icon: '▲', timestamp: 'Active Leg', title: 'Midwest Trunkline Corridor', description: 'Continuous cellular & satellite telematics pinging every 15 minutes.', active: true },
    { icon: '🕐', timestamp: 'ETA Oct 24 • 14:00', title: 'DFW Inbound Geofence', description: 'Automated dock arrival alert scheduled upon corridor entry.' },
  ],
  equipment: [
    { label: 'DESIGNATED EQUIPMENT', value: "53' Dry Van (Air Ride)", sub: 'Equipped with load bars & e-track' },
    { label: 'FREIGHT CATEGORY', value: 'General Commercial Goods', sub: 'Class 70 • Standard Palletized' },
    { label: 'MANIFEST WEIGHT & CUBAGE', value: '38,500 lbs • 2,800 cu ft', sub: 'Compliant with bridge formula limits' },
    { label: 'SECURITY SEAL CONFIRMATION', value: 'SL-88491-X [INTACT]', sub: 'High-security ISO 17712 bolt seal', mono: true },
    { label: 'ASSIGNED MOTOR CARRIER TRUST', value: 'Tier 2 Verified Fleet', sub: 'FMCSA Active SAFER • $1,000,000 COI' },
    { label: 'TRACKING ENGINE & PROTOCOL', value: 'MovingWyze Gateway v4.2', sub: 'End-to-End Cryptographic Handshake' },
  ],
};

export const deliveredResult: TrackingResult = {
  ...inTransitResult,
  jobId: 'FTL-8820-CHI',
  status: 'delivered',
  routeName: 'Chicago–Houston Express',
  lastPing: '2 days ago',
  waypoint: 'DFW Hub — Delivery Confirmed',
  progressPercent: 100,
  progressLabel: 'Delivered',
  eta: 'Delivered Oct 23 • 11:42 CST',
  scheduleNote: 'Completed — All milestones closed',
  milestones: [
    { icon: '✓', timestamp: 'Oct 20 • 09:00', title: 'Dispatched & Tender Locked', description: 'Bill of Lading authenticated. Equipment verified on SAFER registry.' },
    { icon: '✓', timestamp: 'Oct 20 • 14:00', title: 'Departed Chicago Hub', description: 'Outbound gate checkpoint cleared. Bolt seal inspection verified.' },
    { icon: '✓', timestamp: 'Oct 22 • 18:30', title: 'Midwest Trunkline Corridor', description: 'All corridor checkpoints cleared without incident.' },
    { icon: '✓', timestamp: 'Oct 23 • 11:42', title: 'Delivered — DFW Hub', description: 'Receiver POD signed. Seal confirmed intact on unload.', active: false },
  ],
};
