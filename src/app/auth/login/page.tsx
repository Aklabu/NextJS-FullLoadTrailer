import { LoginPage } from '@/features/auth/login';

export const metadata = {
  title: 'Log In — FullLoadTrailer',
  description: 'Sign in to your FullLoadTrailer account.',
};

export default function LoginRoute() {
  return <LoginPage />;
}
