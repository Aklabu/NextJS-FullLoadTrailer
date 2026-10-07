import { CarrierLoadDetailPage } from '@/features/marketplace/carrier';

export const metadata = {
  title: 'Load Detail — FullTrailerLoad',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CarrierLoadDetailRoute({ params }: Props) {
  const { id } = await params;
  return <CarrierLoadDetailPage id={id} />;
}
