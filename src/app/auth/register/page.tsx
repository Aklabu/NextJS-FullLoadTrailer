import { Suspense } from 'react';
import { RegisterPage } from '@/features/auth/register';

export const metadata = {
  title: 'Create Account — FullTrailerLoad',
  description: 'Register your company on FullTrailerLoad to post loads, place bids, and connect with verified carriers.',
};

// RegisterPage uses useSearchParams — wrap in Suspense as required by Next.js App Router
export default function RegisterRoute() {
  return (
    <Suspense>
      <RegisterPage />
    </Suspense>
  );
}
