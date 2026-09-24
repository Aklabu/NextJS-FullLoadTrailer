import type { Metadata } from 'next';
import '@/features/public/how-it-works/how-it-works.css';
import {
  HeroSection,
  ExecutionSection,
  RolesSection,
  TiersSection,
  FaqSection,
} from '@/features/public/how-it-works';

export const metadata: Metadata = {
  title: 'How It Works — FullTrailerLoad',
  description:
    'Discover how FullTrailerLoad powers seamless freight execution — from community bulletin board spot dispatching to legally binding digital rate confirmations.',
};

export default function HowItWorksPage() {
  return (
    <div style={{ background: '#fdf6ee', minHeight: '100vh' }}>
      <HeroSection />
      <ExecutionSection />
      <RolesSection />
      <TiersSection />
      <FaqSection />
    </div>
  );
}
