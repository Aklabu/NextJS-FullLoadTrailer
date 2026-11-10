'use client';

import Image from 'next/image';
import Link from 'next/link';

// The dark background colour used everywhere — must be identical to section bg
const BG = 'rgb(7,25,36)';

const chips = [
  { icon: '👤', label: 'Profile Setup' },
  { icon: '📋', label: 'Load Posting' },
  { icon: '📅', label: 'Booking Coordination' },
  { icon: '🔄', label: 'Job Updates' },
];



export default function HeroSection() {
  return (
    <section
      style={{
        // Solid dark bg — the gradient overlay on the image fades INTO this exact colour
        background: BG,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Main two-column row ── */}
      <div
        style={{
          display: 'flex',
          minHeight: '56vh',
          alignItems: 'stretch',
          position: 'relative',
        }}
      >
        {/* ── LEFT: image, 60% wide, bleeds slightly past its own boundary ── */}
        <div
          style={{
            // 60% + extra 120px so the gradient has room to dissolve
            width: 'calc(60% + 120px)',
            flexShrink: 0,
            position: 'relative',
            // Pull right edge back so it doesn't push content — overlap is handled by content z-index
            marginRight: '-120px',
            zIndex: 0,
          }}
        >
          <Image
            src="/images/flt_assist/ftl_assist_1.jpg"
            alt="FTL Assist dashboard"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
            sizes="65vw"
          />

          {/* Gradient overlay: fully transparent on left, fully opaque BG on right edge.
              The opaque stop matches the section background exactly — zero seam. */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                to right,
                transparent 0%,
                transparent 30%,
                rgba(7,25,36,0.3)  50%,
                rgba(7,25,36,0.75) 70%,
                rgba(7,25,36,0.95) 88%,
                ${BG} 100%
              )`,
            }}
          />

          {/* Bottom fade */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 140,
              background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
            }}
          />
        </div>

        {/* ── RIGHT: content, 40% wide, sits above the bleed zone ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 28,
            padding: '60px 56px 40px 0',
            position: 'relative',
            zIndex: 1,
          }}
          className="ftl-hero-content"
        >
          {/* Live badge */}
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(252,63,7,0.12)',
                border: '1px solid rgba(252,63,7,0.3)',
                borderRadius: 999,
                padding: '6px 16px',
                fontSize: 11,
                fontWeight: 700,
                color: '#fc3f07',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#fc3f07',
                  display: 'inline-block',
                  animation: 'ftlPulse 2s ease-in-out infinite',
                }}
              />
              Managed Logistics Support — Now Available
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #fc3f07, #c43206)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(252,63,7,0.4)',
                }}
              >
                🚚
              </div>
              <h1
                style={{
                  fontSize: 'clamp(36px, 4vw, 58px)',
                  fontWeight: 800,
                  lineHeight: 1,
                  margin: 0,
                  letterSpacing: -1,
                }}
              >
                <span style={{ color: '#ffffff' }}>FTL </span>
                <span
                  style={{
                    background: 'linear-gradient(90deg, #fc3f07 20%, #ff7a45 80%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Assist
                </span>
              </h1>
            </div>
            <p style={{ fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 600, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
              Your Back Office, Handled.
            </p>
            <p style={{ fontSize: 15, fontStyle: 'italic', color: 'rgba(252,63,7,0.9)', margin: 0, fontWeight: 500 }}>
              You run your moving business. We&apos;ll handle the logistics.
            </p>
          </div>

          {/* Body */}
          <p style={{ fontSize: 15, color: 'rgba(195,215,222,0.85)', lineHeight: 1.8, margin: 0, maxWidth: 460 }}>
            Running a moving company, carrier, or moving brokerage takes time.
            Our team manages your FullTrailerLoad account, posts loads, finds
            qualified partners, coordinates bookings, and keeps everything
            updated — so you can focus on growing your business.
          </p>

          {/* Feature chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {chips.map((c) => (
              <span
                key={c.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.88)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ fontSize: 16 }}>{c.icon}</span>
                {c.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              href="/contact?subject=FTL+Assist+Request"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #fc3f07, #d43206)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 15,
                padding: '14px 28px',
                borderRadius: 10,
                textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(252,63,7,0.38)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 10px 32px rgba(252,63,7,0.52)';
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = 'none';
                el.style.boxShadow = '0 6px 24px rgba(252,63,7,0.38)';
              }}
            >
              Request FTL Assist
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="#what-we-do"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'rgba(195,215,222,0.65)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(195,215,222,0.65)'; }}
            >
              See what we handle
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>



      <style>{`
        @keyframes ftlPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(252,63,7,0.25); }
          50%       { box-shadow: 0 0 0 7px rgba(252,63,7,0.06); }
        }
        @media (max-width: 900px) {
          .ftl-hero-content { padding: 48px 24px 40px !important; }
        }
      `}</style>
    </section>
  );
}
