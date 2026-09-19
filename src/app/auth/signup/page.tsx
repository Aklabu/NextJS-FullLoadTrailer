import { RoleSelectionPage } from '@/features/auth/signup';

export const metadata = {
  title: 'Create Account — FullLoadTrailer',
  description: 'Choose your account type to get started on FullLoadTrailer.',
};

export default function SignUpRoleSelectionRoute() {
  return <RoleSelectionPage />;
}
