import { EditLoadPage } from '@/features/marketplace/shipper';

export const metadata = {
  title: 'Edit Load — FullTrailerLoad',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLoadRoute({ params }: Props) {
  const { id } = await params;
  return <EditLoadPage id={id} />;
}
