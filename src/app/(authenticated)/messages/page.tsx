import { Suspense } from 'react';
import { MessagingInboxPage } from '@/features/messaging';

export const metadata = {
  title: 'Messages — FullTrailerLoad',
  description: 'View all your job-linked conversations and community channels.',
};

export default function MessagesRoute() {
  return (
    <Suspense fallback={<div className="flex min-h-[300px] items-center justify-center text-sm text-neutral-400">Loading messages…</div>}>
      <MessagingInboxPage />
    </Suspense>
  );
}
