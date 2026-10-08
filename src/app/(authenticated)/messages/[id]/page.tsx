import { ConversationPage } from '@/features/messaging';

export const metadata = {
  title: 'Conversation — FullTrailerLoad',
};

export default async function ConversationRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConversationPage conversationId={id} />;
}
