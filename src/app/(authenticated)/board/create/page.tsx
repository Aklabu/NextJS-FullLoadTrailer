import { CreatePostPage } from '@/features/bulletin-board';

export const metadata = {
  title: 'Create Post — Bulletin Board — FullLoadTrailer',
  description: 'Post your available load or trailer capacity to the community board.',
};

export default function CreatePostRoute() {
  return <CreatePostPage />;
}
