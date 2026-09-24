import { VerifyStatusPage } from '@/features/auth/verify-status';

export const metadata = {
  title: 'Verification Status — FullTrailerLoad',
  description: 'Check the status of your FullTrailerLoad account verification.',
};

export default function VerifyStatusRoute() {
  return <VerifyStatusPage />;
}
