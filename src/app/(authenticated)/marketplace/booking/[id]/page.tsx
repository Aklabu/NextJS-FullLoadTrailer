import { BookingConfirmationPage } from '@/features/marketplace/shipper';

export const metadata = {
  title: 'Booking Confirmed — FullLoadTrailer',
  description: 'Your load has been booked. Review the confirmed terms and next steps.',
};

export default async function BookingConfirmationRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingConfirmationPage id={id} />;
}
