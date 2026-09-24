import { BoardFeedPage } from '@/features/bulletin-board';

export const metadata = {
  title: 'Bulletin Board — FullTrailerLoad',
  description: 'Browse community load and capacity posts from verified peers.',
};

export default function BoardFeedRoute() {
  return <BoardFeedPage />;
}
