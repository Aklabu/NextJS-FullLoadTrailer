import { Suspense } from 'react';
import { NewConversationPage } from '@/features/messaging';

export const metadata = {
  title: 'New Message — FullTrailerLoad',
};

export default function NewConversationRoute() {
  return (
    <Suspense fallback={<div className="flex min-h-[300px] items-center justify-center text-sm text-neutral-400">Loading…</div>}>
      <NewConversationPage />
    </Suspense>
  );
}
