import Image from 'next/image';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 220,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background truck image */}
      <Image
        src="/images/flt_assist/ftl_assist_4.jpeg"
        alt="Truck on highway at sunset"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(15,48,64,0.92) 0%, rgba(15,48,64,0.80) 60%, rgba(15,48,64,0.5) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1100,
          padding: '56px 48px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'left',
        }}
      >
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
          Ready to Let Us Handle the Work?
        </h2>
        <p style={{ color: '#c8d8dc', fontSize: 15, marginBottom: 28, maxWidth: 500 }}>
          Spend less time managing the load board and more time running your business.
        </p>
        <Link
          href="/contact?subject=FTL+Assist+Request"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#fc3f07',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 16,
            padding: '14px 32px',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Request FTL Assist →
        </Link>
      </div>
    </section>
  );
}
