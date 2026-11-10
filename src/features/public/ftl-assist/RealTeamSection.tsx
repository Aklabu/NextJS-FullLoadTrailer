import Image from 'next/image';

// Must match the section background exactly so the gradient dissolves seamlessly
const BG = 'rgb(255,255,255)';

export default function RealTeamSection() {
  return (
    <section
      style={{
        background: BG,
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          minHeight: 420,
          alignItems: 'stretch',
        }}
      >
        {/* ── LEFT: image bleeds 40px past container into the content zone ── */}
        <div
          style={{
            width: 'calc(42% + 100px)',
            flexShrink: 0,
            position: 'relative',
            marginRight: '-100px',
            zIndex: 0,
          }}
        >
          <Image
            src="/images/flt_assist/ftl_assist_3.jpg"
            alt="FTL Assist team member"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="45vw"
          />
          {/* Gradient: transparent on left → solid white on right edge — zero seam */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                to right,
                transparent 0%,
                transparent 25%,
                rgba(255,255,255,0.25) 48%,
                rgba(255,255,255,0.75) 70%,
                rgba(255,255,255,0.95) 88%,
                ${BG} 100%
              )`,
            }}
          />
        </div>

        {/* ── RIGHT: content, sits above the bleed ── */}
        <div
          className="ftl-team-content"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 20,
            padding: '56px 56px 56px 0',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            A Real Team. Real Support.
          </h2>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: 0 }}>
            FTL Assist starts with real people who understand the household moving industry. You don&apos;t have to spend hours learning software or managing every detail yourself. Our team can operate your account, find the right partners, and coordinate the work with you.
          </p>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            As FullTrailerLoad grows, we&apos;ll continue introducing smarter tools and automation to make the process even easier.
          </p>

          {/* Performance-based callout */}
          <div
            style={{
              background: '#0F3040',
              borderRadius: 12,
              padding: '18px 22px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              maxWidth: 520,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#fc3f07',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              🤝
            </div>
            <div>
              <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>
                Simple, Performance-Based Service
              </p>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                FTL Assist is an optional service available to eligible FullTrailerLoad members. Instead of another monthly subscription, the service uses an agreed fee based on qualifying completed bookings.{' '}
                <strong style={{ color: '#c8d8dc' }}>
                  Your service fee and terms are confirmed before the booking.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ftl-team-content { padding: 40px 24px !important; }
        }
      `}</style>
    </section>
  );
}
