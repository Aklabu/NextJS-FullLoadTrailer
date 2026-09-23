export type LoadStatus = 'open' | 'bidding' | 'booked' | 'completed' | 'expired' | 'draft';
export type PricingMode = 'fixed' | 'best_offer' | 'open_bidding';
export type BidStatus = 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';
export type Visibility = 'public' | 'private';

export interface LoadParty {
  id: string;
  companyName: string;
  role: 'shipper' | 'broker' | 'carrier';
  verificationStatus: 'verified' | 'basic' | 'pending';
  avgRating?: number;
}

export interface Bid {
  id: string;
  carrier: LoadParty;
  amount: number;
  counterAmount?: number;
  status: BidStatus;
  placedAt: string;
  updatedAt: string;
  note?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
}

export interface MarketplaceLoad {
  id: string;
  jobId: string; // e.g. FTL-2026-0042
  status: LoadStatus;
  pricingMode: PricingMode;
  visibility: Visibility;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  cubicFeet: number;
  equipmentType: string;
  weight?: number;
  specialRequirements?: string;
  fixedPrice?: number;
  postedAt: string;
  expiresAt?: string;
  poster: LoadParty;
  bids: Bid[];
  acceptedBid?: Bid;
  auditLog: AuditEntry[];
}

export const PRICING_MODE_LABELS: Record<PricingMode, string> = {
  fixed: 'Fixed Price',
  best_offer: 'Best Offer',
  open_bidding: 'Open Bidding',
};

export const LOAD_STATUS_COLORS: Record<LoadStatus, { bg: string; text: string; label: string }> = {
  open:      { bg: '#e0f2fe', text: '#0369a1', label: 'Open' },
  bidding:   { bg: '#fff7ed', text: '#d93506', label: 'Bidding' },
  booked:    { bg: '#d1fae5', text: '#065f46', label: 'Booked' },
  completed: { bg: '#f0fdf4', text: '#15803d', label: 'Completed' },
  expired:   { bg: '#f5f5f4', text: '#78716c', label: 'Expired' },
  draft:     { bg: '#fafaf9', text: '#a8a29e', label: 'Draft' },
};

export const BID_STATUS_COLORS: Record<BidStatus, { bg: string; text: string; label: string }> = {
  pending:   { bg: '#fff7ed', text: '#d93506', label: 'Pending' },
  countered: { bg: '#fef3c7', text: '#92400e', label: 'Countered' },
  accepted:  { bg: '#d1fae5', text: '#065f46', label: 'Accepted' },
  rejected:  { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' },
  withdrawn: { bg: '#f5f5f4', text: '#78716c', label: 'Withdrawn' },
};
