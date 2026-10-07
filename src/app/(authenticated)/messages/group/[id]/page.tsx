import { GroupConversationPage } from '@/features/messaging';

export const metadata = {
  title: 'Community Chat — FullTrailerLoad',
  description: 'Industry-wide group chat for shippers, brokers, and carriers.',
};

// Channel-scoped group chat — id param reserved for future multi-channel support
export default function GroupChannelRoute() {
  return <GroupConversationPage />;
}
