import type { Metadata } from 'next';
import HeroSection from '@/features/public/homepage/HeroSection';
import StatsBar from '@/features/public/homepage/StatsBar';
import MethodologySection from '@/features/public/homepage/MethodologySection';
import TiersSection from '@/features/public/homepage/TiersSection';
import TrustSection from '@/features/public/homepage/TrustSection';
import FaqSection from '@/features/public/homepage/FaqSection';

export const metadata: Metadata = {
  title: 'FullLoadTrailer — Full Trailer Loads. Real Carriers. Zero Friction.',
  description:
    'Move beyond static bulletin boards. FullLoadTrailer connects verified shippers, brokers, and carriers through transparent bidding, binding rate confirmations, and vetted carrier trust.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <div className="px-6 pt-8">
        <HeroSection />
      </div>
      <StatsBar />
      <MethodologySection />
      <TiersSection />
      <TrustSection />
      <FaqSection />
    </div>
  );
}
