export type PostType = 'load_available' | 'capacity_available';

export type EquipmentType =
  | 'any'
  | 'flatbed'
  | 'dry_van'
  | 'reefer'
  | 'step_deck'
  | 'lowboy'
  | 'box_truck'
  | 'sprinter';

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
  flatbed: 'Flatbed',
  dry_van: 'Dry Van',
  reefer: 'Refrigerated',
  step_deck: 'Step Deck',
  lowboy: 'Lowboy',
  box_truck: 'Box Truck',
  sprinter: 'Sprinter / Cargo Van',
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  load_available: 'Load Available',
  capacity_available: 'Capacity Available',
};
