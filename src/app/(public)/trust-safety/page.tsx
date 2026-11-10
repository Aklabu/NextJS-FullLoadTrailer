import type { Metadata } from 'next';
import {
  HeroSection,
  VerificationProcessSection,
  ExtraChecksSection,
  OngoingSafetySection,
  CtaSection,
} from '@/features/public/trust-safety';

export const metadata: Metadata = {
  title: 'Trust & Safety — FullTrailerLoad',
  description:
    'A safer, verified marketplace for moving brokers, moving companies, and motor carriers — with industry-specific checks before access is granted.',
};

export default function TrustSafetyPage() {
  return (
    <div>
      <HeroSection />
      <VerificationProcessSection />
      <ExtraChecksSection />
      <OngoingSafetySection />
      <CtaSection />
    </div>
  );
}
