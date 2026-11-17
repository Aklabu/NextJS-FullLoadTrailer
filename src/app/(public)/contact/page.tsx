import type { Metadata } from 'next';
import {
  ContactHero,
  ServicesStrip,
  PricingStrip,
  ContactForm,
  GetInTouchSidebar,
} from '@/features/public/contact';

export const metadata: Metadata = {
  title: 'Contact Us — FTL Assist | FullTrailerLoad',
  description:
    'Have questions or want to get started with FTL Assist? Send us a message or contact us directly.',
};

export default function ContactPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* Hero banner with truck image */}
      <ContactHero />

      {/* 5-column services icon strip */}
      <ServicesStrip />

      {/* Flat-percentage pricing strip */}
      <PricingStrip />

      {/* Page heading */}
      <div className="text-center py-10 px-4">
        <h2 className="text-3xl font-black mb-2" style={{ color: '#1a1a1a' }}>
          Contact Us – FTL Assist
        </h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Have questions or want to get started with FTL Assist?
          <br />
          Send us a message or contact us directly.
        </p>
      </div>

      {/* Form + Sidebar */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <ContactForm />
          <GetInTouchSidebar />
        </div>
      </section>

    </div>
  );
}
