import { CapacityOffersPage } from '@/features/marketplace/carrier';

export const metadata = {
  title: 'Capacity Offers — FullTrailerLoad',
  description: 'View offers from shippers and brokers interested in your capacity posting.',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CapacityOffersRoute({ params }: Props) {
  const { id } = await params;
  return <CapacityOffersPage id={id} />;
}
