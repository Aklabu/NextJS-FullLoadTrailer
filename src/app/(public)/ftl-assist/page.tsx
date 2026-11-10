import type { Metadata } from 'next';
import {
  HeroSection,
  WhatWeDoSection,
  WhoCanUseSection,
  RealTeamSection,
  HowItWorksSection,
  CtaSection,
} from '@/features/public/ftl-assist';

export const metadata: Metadata = {
  title: 'FTL Assist — FullTrailerLoad',
  description:
    'Let our team manage your FullTrailerLoad account, post your loads, find qualified partners, and coordinate bookings — so you can focus on growing your business.',
};

export default function FtlAssistPage() {
  return (
    <div>
      <HeroSection />
      <WhatWeDoSection />
      <WhoCanUseSection />
      <RealTeamSection />
      <HowItWorksSection />
      <CtaSection />
    </div>
  );
}
