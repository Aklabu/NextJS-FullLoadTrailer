import type { Metadata } from 'next';
import '@/features/public/contact/contact.css';
import {
  ContactHero,
  ContactMethods,
  ContactForm,
  MapSidebar,
  ContactFaq,
} from '@/features/public/contact';

export const metadata: Metadata = {
  title: 'Contact & Support — FullTrailerLoad',
  description:
    'Get in touch with the FullTrailerLoad operations team for onboarding help, SAFER verification, rate confirmation disputes, or emergency dispatch support.',
};

export default function ContactPage() {
  return (
    <div style={{ background: '#fdf6ee', minHeight: '100vh' }}>
      <ContactHero />
      <ContactMethods />

      {/* Form + Sidebar layout */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 24, alignItems: 'start' }}
          className="contact-form-layout"
        >
          <ContactForm />
          <MapSidebar />
        </div>
      </section>

      <ContactFaq />
    </div>
  );
}
