export type TrackingStatus = 'in_transit' | 'delivered' | 'not_picked' | 'not_found' | 'idle';

export interface TrackingResult {
  jobId: string;
  status: TrackingStatus;
  routeName: string;
  lastPing: string;
  waypoint: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  distance: string;
  eta: string;
  scheduleNote: string;
  progressPercent: number;
  progressLabel: string;
  milestones: Milestone[];
  equipment: EquipmentField[];
}

export interface Milestone {
  icon: string;
  timestamp: string;
  title: string;
  description: string;
  active?: boolean;
}

export interface EquipmentField {
  label: string;
  value: string;
  sub: string;
  mono?: boolean;
}
