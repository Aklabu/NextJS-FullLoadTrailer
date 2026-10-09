// GET /marketplace/bookings/{booking_id}/
// Accessible by either party on the booking (shipper or carrier).
// Contact details (email, phone) are revealed here only — post-booking gate.
// 404 if not found, 403 if caller is not a party to the booking.

import { apiFetch } from '@/lib/api/client';

export interface BookingParty {
  id: string;
  company_name: string;
  email: string;
  phone: string;
}

export interface BookingLoad {
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  cubic_feet: number;
  equipment_type: string;
}

export interface BookingDetail {
  id: string;
  booking_ref: string;
  job_id: string;
  confirmed_at: string;
  agreed_price: string;
  status: 'booked' | 'in_transit' | 'completed';
  completed_by_shipper: boolean;
  completed_by_carrier: boolean;
  completed_at: string | null;
  load: BookingLoad;
  shipper: BookingParty;
  carrier: BookingParty;
}

export interface GetBookingResponse {
  status: 'success';
  message: string;
  data: BookingDetail;
}

export async function getBooking(bookingId: string): Promise<GetBookingResponse> {
  return apiFetch<GetBookingResponse>(`/api/marketplace/bookings/${bookingId}/`);
}

// POST /marketplace/bookings/{booking_id}/complete/
// Mark the booking as completed from the caller's perspective.
// Both parties must call this before reviews can be submitted.

export interface CompleteBookingResponse {
  success: true;
  message: string;
  data: {
    booking_id: string;
    both_completed: boolean;
    completed_by_shipper: boolean;
    completed_by_carrier: boolean;
    completed_at: string | null;
  };
}

export async function completeBooking(bookingId: string): Promise<CompleteBookingResponse> {
  return apiFetch<CompleteBookingResponse>(`/api/marketplace/bookings/${bookingId}/complete/`, {
    method: 'POST',
  });
}
