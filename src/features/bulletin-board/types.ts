export type PostType = 'load_available' | 'truck_trailer_available';

export type EquipmentType =
  | 'any'
  | 'box_truck'
  | 'moving_trailer'
  | 'dry_van_side_door';

export interface BoardPost {
  id: string;
  postType: PostType;
  origin: string;
  destination: string;
  equipmentType: EquipmentType;
  cubicFeet: number;
  pickupDate: string; // ISO date string
  description: string;
  postedAt: string; // ISO datetime
  poster: {
    id: string;
    companyName: string;
    verificationStatus: 'verified' | 'basic' | 'pending' | 'unverified';
  };
}

export interface BoardFilters {
  origin: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  equipmentType: EquipmentType;
  postType: PostType | 'all';
}

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  any: 'Any equipment',
  box_truck: 'Box Truck',
  moving_trailer: 'Moving Trailer',
  dry_van_side_door: 'Dry Van (Side Door)',
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  load_available: 'Load Available',
  truck_trailer_available: 'Truck / Trailer Available',
};
