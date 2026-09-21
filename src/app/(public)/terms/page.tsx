import LegalPage from '@/features/public/legal/LegalPage';
import { termsContent } from '@/features/public/legal/terms-content';

export const metadata = {
  title: 'Terms of Service — FullLoadTrailer',
  description: 'Read the FullLoadTrailer Terms of Service.',
};

export default function TermsRoute() {
  return <LegalPage {...termsContent} />;
}
