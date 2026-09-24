import { SubscriptionPage } from '@/features/account/subscription';

export const metadata = {
  title: 'Subscription & Tier — FullTrailerLoad',
  description: 'View your current plan and upgrade to the Marketplace tier.',
};

export default function SubscriptionRoute() {
  return <SubscriptionPage />;
}
