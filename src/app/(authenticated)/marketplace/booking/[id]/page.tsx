import { BookingConfirmationPage } from '@/features/marketplace/shipper';

export const metadata = {
  title: 'Booking Confirmed — FullLoadTrailer',
  description: 'Your load has been booked. Review the confirmed terms and next steps.',
};

export default function BookingConfirmationRoute() {
  return <BookingConfirmationPage />;
}
