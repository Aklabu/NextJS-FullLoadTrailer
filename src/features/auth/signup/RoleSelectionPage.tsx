'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Role = 'shipper' | 'carrier' | 'broker';

// House icon — Moving Company
function HouseIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56" aria-hidden="true">
      <path d="M32 8L6 28h8v24h16V38h4v14h16V28h8L32 8z" fill="#1e40af" opacity="0.15" />
      <path d="M32 8L6 28h8v24h16V38h4v14h16V28h8L32 8z" stroke="#1e40af" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <rect x="24" y="38" width="16" height="14" rx="1" stroke="#1e40af" strokeWidth="2" fill="none" />
      <circle cx="32" cy="22" r="4" fill="#1e40af" opacity="0.4" />
    </svg>
  );
}

// Truck icon — Carrier
function TruckIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56" aria-hidden="true">
      <rect x="4" y="20" width="36" height="24" rx="2" fill="#fc3f07" opacity="0.15" stroke="#fc3f07" strokeWidth="2.5" />
      <path d="M40 28h10l8 8v8H40V28z" fill="#fc3f07" opacity="0.15" stroke="#fc3f07" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="14" cy="46" r="5" fill="white" stroke="#fc3f07" strokeWidth="2.5" />
      <circle cx="50" cy="46" r="5" fill="white" stroke="#fc3f07" strokeWidth="2.5" />
      <line x1="4" y1="38" x2="58" y2="38" stroke="#fc3f07" strokeWidth="1.5" strokeDasharray="4 2" />
    </svg>
  );
}

// Handshake icon — Broker
function HandshakeIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56" aria-hidden="true">
      <path d="M4 36l12-12 8 4 8-4 12 12" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M4 36l8 8 20-16 20 8 8-8" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24 28l8 8 8-8" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="32" cy="20" r="6" fill="#1e40af" opacity="0.12" stroke="#1e40af" strokeWidth="2" />
    </svg>
  );
}

const roles = [
  {
    role: 'shipper' as Role,
    Icon: HouseIcon,
    title: 'Moving Company',
    subtitle: '(Post Loads)',
    description: 'Find reliable carriers, manage shipments, and complete moves.',
    btnLabel: 'Register as a Mover',
    btnBg: '#1e40af',
    btnHover: '#1a3a9f',
  },
  {
    role: 'carrier' as Role,
    Icon: TruckIcon,
    title: 'Carrier',
    subtitle: '(Find Loads)',
    description: 'Search and book household moving loads, (full or partial).',
    btnLabel: 'Register as a Carrier',
    btnBg: '#fc3f07',
    btnHover: '#d93506',
  },
  {
    role: 'broker' as Role,
    Icon: HandshakeIcon,
    title: 'Household Goods Broker',
    subtitle: '(Post Loads)',
    description: 'Post loads and find qualified carriers and moving companies.',
    btnLabel: 'Register as a Broker',
    btnBg: '#1e40af',
    btnHover: '#1a3a9f',
  },
];

const benefits = [
  'Create your company profile',
  'Access to the load board',
  'Use industry tools (closing sheets, tracking, etc.)',
  'Grow your network in the moving industry.',
];

export default function RoleSelectionPage() {
  const router = useRouter();

  function handleSelect(role: Role) {
    router.push(`/auth/register?role=${role}`);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Hero banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2d55 0%, #1e3a6e 60%, #c43206 100%)',
          padding: '40px 24px 36px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 10px',
            letterSpacing: -0.5,
          }}
        >
          Create Your Account
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
          Join the #1 Marketplace for Household Moving.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 64px' }}>

        {/* ── Choose account type ── */}
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#0f2d55',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          Choose Your Account Type
        </h2>

        {/* Role cards */}
        <div
          className="signup-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            marginBottom: 56,
          }}
        >
          {roles.map((r) => (
            <div
              key={r.role}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: 16,
                padding: '32px 24px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 0,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {/* Icon */}
              <div style={{ marginBottom: 16 }}>
                <r.Icon />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#0f2d55',
                  margin: '0 0 2px',
                  lineHeight: 1.2,
                }}
              >
                {r.title}
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 14px', fontWeight: 500 }}>
                {r.subtitle}
              </p>

              {/* Description */}
              <p
                style={{
                  fontSize: 14,
                  color: '#475569',
                  lineHeight: 1.65,
                  margin: '0 0 24px',
                  flex: 1,
                }}
              >
                {r.description}
              </p>

              {/* CTA button */}
              <button
                type="button"
                onClick={() => handleSelect(r.role)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: r.btnBg,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.15s, transform 0.1s',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = r.btnHover;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = r.btnBg;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                }}
                aria-label={r.btnLabel}
              >
                {r.btnLabel}
              </button>
            </div>
          ))}
        </div>

        {/* ── Account Benefits ── */}
        {/* Single row: image bleeds from right, text floats on left over gradient */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 16,
            background: '#f8fafc',
            minHeight: 280,
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          {/* Image — covers right 55%, bleeds 80px left into the text zone */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'calc(55% + 80px)',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/images/signup/fulltrailerload.jpg"
              alt="FullTrailerLoad.com on a laptop"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
              sizes="55vw"
            />
            {/* Left-edge fade dissolving into #f8fafc — no visible seam */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgb(248,250,252) 0%, rgba(248,250,252,0.7) 18%, rgba(248,250,252,0) 38%)',
              }}
            />
          </div>

          {/* Text content — left 50%, sits above the image layer */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '50%',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            className="signup-benefits-text"
          >
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 26,
                fontWeight: 700,
                color: '#0f2d55',
                marginBottom: 24,
              }}
            >
              Account Benefits
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {benefits.map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M20 6L9 17l-5-5" stroke="#fc3f07" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.5 }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: '#64748b' }}>
          Already have an account?{' '}
          <Link
            href="/auth/login"
            style={{ color: '#fc3f07', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}
          >
            Log In
          </Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .signup-cards { grid-template-columns: 1fr !important; }
          .signup-benefits-text { width: 100% !important; padding: 36px 24px !important; }
        }
      `}</style>
    </div>
  );
}
