import { Suspense } from 'react';
import VerifyEmailPage from '@/features/auth/verify-email/VerifyEmailPage';

export const metadata = {
  title: 'Verify Your Email — FullTrailerLoad',
  description: 'Enter the 6-digit code sent to your email to activate your FullTrailerLoad account.',
};

export default function VerifyEmailRoute() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
