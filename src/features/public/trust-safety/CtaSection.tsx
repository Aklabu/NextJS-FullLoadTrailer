import Image from 'next/image';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: 200, display: 'flex', alignItems: 'center' }}>
      {/* Background image */}
      <Image
        src="/images/trust_safety/trust-safety-2.avif"
        alt="Household goods moving boxes"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      {/* Dark overlay — heavier on left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(15,48,64,0.95) 0%, rgba(15,48,64,0.85) 55%, rgba(15,48,64,0.5) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '56px 48px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 12px',
            maxWidth: 520,
          }}
        >
          A More Trusted Marketplace<br />for the Household Goods Moving Industry.
        </h2>
        <Link
          href="/auth/signup"
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
            marginTop: 20,
            boxShadow: '0 4px 16px rgba(252,63,7,0.35)',
          }}
        >
          Join FullTrailerLoad.com →
        </Link>
      </div>
    </section>
  );
}
