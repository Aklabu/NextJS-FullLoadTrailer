import { MessagingInboxPage } from '@/features/messaging';

export const metadata = {
  title: 'Messages — FullLoadTrailer',
  description: 'View all your job-linked conversations.',
};

export default function MessagesRoute() {
  return <MessagingInboxPage />;
}
