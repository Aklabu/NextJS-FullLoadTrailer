import { LoadDetailPage } from '@/features/marketplace/shipper';

export const metadata = {
  title: 'Load Detail — FullTrailerLoad',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LoadDetailRoute({ params }: Props) {
  const { id } = await params;
  return <LoadDetailPage id={id} />;
}
