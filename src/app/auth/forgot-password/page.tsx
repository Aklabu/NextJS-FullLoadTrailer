import { ForgotPasswordPage } from '@/features/auth/forgot-password';

export const metadata = {
  title: 'Reset Password — FullTrailerLoad',
  description: 'Reset your FullTrailerLoad account password via email OTP.',
};

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
