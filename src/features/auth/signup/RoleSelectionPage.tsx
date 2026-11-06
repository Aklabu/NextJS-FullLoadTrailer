'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Role = 'shipper' | 'broker' | 'carrier';

// Icon: building (moving company)
function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 42V14l18-8 18 8v28H30V28h-12v14H6zm6-6h6v-6h-6v6zm0-12h6v-6h-6v6zm12 0h6v-6h-6v6zm12 12h6v-6h-6v6zm0-12h6v-6h-6v6z" />
    </svg>
  );
}

// Icon: truck (carrier)
function TruckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 34v-4h2V14h24v16h2v4H4zm6-4h16V18H10v12zm22 4v-4h2V20l-5-6h-5v-2h6.5L36 19.5V30h2v4h-6zm-24 6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm28 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
}

// Icon: handshake (broker)
function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className={className} aria-hidden="true">
      <path d="M27.9 40 16 28.1l2.15-2.15 9.75 9.7 14-14L44 23.7 27.9 40zM4 26.25 14.05 16.2l4.2 4.2-9.8 9.8L4 26.25zm10.4 1.5-2.15-2.15 9.8-9.8L27.2 8H44v16.55l-7.25 7.25-2.15-2.1 6.4-6.4V11h-12.5l-4.1 7.75-10 8.8v.2z" />
    </svg>
  );
}

interface RoleCard {
  role: Role;
  preLabel: string | null;
  title: string;
  subtitle: string;
  badge: string;
  bg: string;
  iconColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const roles: RoleCard[] = [
  {
    role: 'shipper',
    preLabel: "I'm a",
    title: 'Moving Company',
    subtitle: 'Post a move or\nfind a carrier',
    badge: 'DEMAND',
    bg: '#1a3a8f',
    iconColor: 'text-white',
    textColor: 'text-white',
    badgeBg: 'rgba(255,255,255,0.15)',
    badgeText: '#fff',
    Icon: BuildingIcon,
  },
  {
    role: 'carrier',
    preLabel: null,
    title: "I'm a Carrier",
    subtitle: 'Find loads or post\nempty space',
    badge: 'SUPPLY',
    bg: '#fc3f07',
    iconColor: 'text-white',
    textColor: 'text-white',
    badgeBg: 'rgba(255,255,255,0.15)',
    badgeText: '#fff',
    Icon: TruckIcon,
  },
  {
    role: 'broker',
    preLabel: "I'm a",
    title: 'Moving Broker',
    subtitle: 'Find moves\nto cover.',
    badge: 'INTERMEDIARY',
    bg: '#ffffff',
    iconColor: 'text-[#1a2e5a]',
    textColor: 'text-[#1a2e5a]',
    badgeBg: 'rgba(26,46,90,0.10)',
    badgeText: '#1a2e5a',
    Icon: HandshakeIcon,
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();

  function handleSelect(role: Role) {
    router.push(`/auth/register?role=${role}`);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(circle at 20% 10%, #fbe3c4, transparent 55%), radial-gradient(circle at 80% 20%, #f6d9d3, transparent 55%), #fdf6ee',
      }}
    >
      {/* Top bar — minimal, just logo + login link */}
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2" aria-label="FullTrailerLoad home">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
            style={{ background: '#ff3d03', color: '#1A1953' }}
            aria-hidden="true"
          >
            FL
          </span>
          <span className="text-base font-semibold tracking-tight text-neutral-900">
            FullTrailer<span style={{ color: '#fc3f07' }}>Load</span>
          </span>
        </Link>

        <span className="text-sm text-neutral-500">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]"
          >
            Log in
          </Link>
        </span>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-[1100px] px-6 pb-20 pt-10">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fc3f07]" />
            CREATE YOUR ACCOUNT
          </span>

          <h1
            className="mt-4 text-[clamp(30px,4.5vw,46px)] font-normal leading-[1.15] text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            How will you use
            <br />
            <span className="italic" style={{ color: '#fc3f07' }}>
              FullTrailerLoad?
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
            Choose your account type to get started. You can always upgrade your tier later.
          </p>
        </div>

        {/* Role cards */}
        <div className="mx-auto grid w-full max-w-[820px] grid-cols-1 gap-4 md:grid-cols-3">
          {roles.map((card) => (
            <button
              key={card.role}
              type="button"
              onClick={() => handleSelect(card.role)}
              className="group flex aspect-square flex-col rounded-2xl p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fc3f07]"
              style={{ background: card.bg, cursor: 'pointer' }}
              aria-label={`Sign up as ${card.title}`}
            >
              {/* Badge row */}
              <div className="mb-auto flex justify-end">
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]"
                  style={{ background: card.badgeBg, color: card.badgeText }}
                >
                  {card.badge}
                </span>
              </div>

              {/* Icon */}
              <div className={`mb-4 ${card.iconColor}`}>
                <card.Icon className="h-12 w-12 opacity-90" />
              </div>

              {/* Pre-label */}
              {card.preLabel && (
                <p className={`text-xs font-bold leading-tight opacity-75 ${card.textColor}`}>
                  {card.preLabel}
                </p>
              )}

              {/* Title */}
              <h2
                className={`text-xl font-bold leading-tight ${card.textColor}`}
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {card.title}
              </h2>

              {/* Subtitle */}
              <p className={`mt-2 text-sm leading-snug opacity-80 ${card.textColor}`}>
                {card.subtitle.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < card.subtitle.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>

              {/* CTA arrow */}
              <div className="mt-6 flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform group-hover:translate-x-1 ${card.role === 'broker' ? 'border-[#1a2e5a]/40 text-[#1a2e5a]' : 'border-white/50 text-white'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={`ml-2.5 text-sm font-semibold opacity-90 ${card.textColor}`}>
                  Select &amp; Continue
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-[13px] text-neutral-400">
          Not sure which to pick?{' '}
          <Link
            href="/how-it-works"
            className="text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]"
          >
            Read how the platform works →
          </Link>
        </p>

      </main>
    </div>
  );
}
