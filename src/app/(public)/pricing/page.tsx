import type { Metadata } from 'next';
import '@/features/public/pricing/pricing.css';
import {
  PricingHero,
  PricingCards,
  ZeroRiskBanner,
  FeatureMatrix,
  PricingFaq,
  PricingCta,
} from '@/features/public/pricing';

export const metadata: Metadata = {
  title: 'Pricing — FullTrailerLoad',
  description:
    'Simple, scalable freight tiers. Start free on the community bulletin board or unlock the full binding digital marketplace with FMCSA compliance and escrow protection.',
};

export default function PricingPage() {
  return (
    <div style={{ background: '#fdf6ee', minHeight: '100vh' }}>
      <PricingHero />
      <PricingCards />
      <ZeroRiskBanner />
      <FeatureMatrix />
      <PricingFaq />
      <PricingCta />
    </div>
  );
}
