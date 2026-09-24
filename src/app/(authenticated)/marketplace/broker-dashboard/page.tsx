import { BrokerDashboardPage } from '@/features/marketplace/shipper';

export const metadata = {
  title: 'Broker Dashboard — FullTrailerLoad',
  description: 'Pipeline overview of all your active and completed jobs.',
};

export default function BrokerDashboardRoute() {
  return <BrokerDashboardPage />;
}
