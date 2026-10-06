// Single source of truth for equipment type options used across board and marketplace.
export const EQUIPMENT_OPTIONS = [
  'Any equipment',
  'Box Truck',
  'Moving Trailer',
  'Dry Van (Side Door)',
] as const;

export type EquipmentOption = (typeof EQUIPMENT_OPTIONS)[number];
