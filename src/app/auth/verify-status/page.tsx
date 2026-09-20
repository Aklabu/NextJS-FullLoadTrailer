import { VerifyStatusPage } from '@/features/auth/verify-status';

export const metadata = {
  title: 'Verification Status — FullLoadTrailer',
  description: 'Check the status of your FullLoadTrailer account verification.',
};

export default function VerifyStatusRoute() {
  return <VerifyStatusPage />;
}
