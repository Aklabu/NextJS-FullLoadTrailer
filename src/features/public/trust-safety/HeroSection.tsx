import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      className="ts-hero-section"
      style={{
        background: '#eef3fb',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 440,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── LEFT 35%: text ── */}
      <div
        className="ts-hero-text"
        style={{
          width: '35%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 48px 64px 48px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            background: '#dbeafe',
            color: '#1e40af',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            padding: '5px 12px',
            borderRadius: 4,
            marginBottom: 20,
            alignSelf: 'flex-start',
          }}
        >
          Built for Household Goods Moving
        </span>

        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 3.2vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.1,
            margin: '0 0 20px',
            color: '#1e2d4a',
          }}
        >
          Trust &amp;{' '}
          <span style={{ color: '#fc3f07' }}>Safety</span>
        </h1>

        <p
          style={{
            fontSize: 16,
            color: '#475569',
            lineHeight: 1.75,
            margin: '0 0 32px',
          }}
        >
          A safer, verified marketplace for moving brokers, moving companies, and motor carriers — with industry-specific checks before access is granted.
        </p>

        <Link
          href="/auth/signup"
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            alignItems: 'center',
            gap: 8,
            background: '#fc3f07',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            padding: '13px 28px',
            borderRadius: 8,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(252,63,7,0.3)',
          }}
        >
          Join FullTrailerLoad.com →
        </Link>
      </div>

      {/* ── RIGHT 65%: image ── */}
      <div
        className="ts-hero-image"
        style={{
          width: '65%',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left-edge fade blending into bg colour */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'linear-gradient(to right, rgba(238,243,251,1) 0%, rgba(238,243,251,0.6) 12%, rgba(238,243,251,0) 28%)',
          }}
        />
        <Image
          src="/images/trust_safety/trust-safety-1.jpg"
          alt="Verified moving truck with FullTrailerLoad shield and compliance checklist"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
          sizes="65vw"
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          /* On mobile: section becomes position:relative so the image can be a full bg */
          .ts-hero-section {
            position: relative !important;
            flex-direction: column !important;
            min-height: 360px !important;
            align-items: stretch !important;
          }
          /* Image fills the section as a background layer */
          section.ts-hero-section .ts-hero-image {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 0 !important;
          }
          /* Text floats above the image */
          section.ts-hero-section .ts-hero-text {
            position: relative !important;
            z-index: 2 !important;
            width: 100% !important;
            padding: 48px 24px 40px !important;
            /* Darken bg so text is legible over the image */
            background: rgba(238,243,251,0.88) !important;
          }
        }
      `}</style>
    </section>
  );
}
