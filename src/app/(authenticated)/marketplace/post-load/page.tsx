import { PostLoadPage } from '@/features/marketplace/shipper';

export const metadata = {
  title: 'Post a Load — FullTrailerLoad',
  description: 'Create a structured, biddable load listing for qualified carriers.',
};

export default function PostLoadRoute() {
  return <PostLoadPage />;
}
