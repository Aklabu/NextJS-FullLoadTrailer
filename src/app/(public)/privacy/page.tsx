import LegalPage from '@/features/public/legal/LegalPage';
import { privacyContent } from '@/features/public/legal/privacy-content';

export const metadata = {
  title: 'Privacy Policy — FullTrailerLoad',
  description: 'Read the FullTrailerLoad Privacy Policy.',
};

export default function PrivacyRoute() {
  return <LegalPage {...privacyContent} />;
}
