import { ForgotPasswordPage } from '@/features/auth/forgot-password';

export const metadata = {
  title: 'Reset Password — FullLoadTrailer',
  description: 'Reset your FullLoadTrailer account password via email OTP.',
};

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
