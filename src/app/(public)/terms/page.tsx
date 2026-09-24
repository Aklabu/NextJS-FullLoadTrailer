import LegalPage from '@/features/public/legal/LegalPage';
import { termsContent } from '@/features/public/legal/terms-content';

export const metadata = {
  title: 'Terms of Service — FullTrailerLoad',
  description: 'Read the FullTrailerLoad Terms of Service.',
};

export default function TermsRoute() {
  return <LegalPage {...termsContent} />;
}
