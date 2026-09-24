'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Role = 'shipper' | 'broker' | 'carrier';

interface RoleCard {
  role: Role;
  icon: string;
  title: string;
  badge: string;
  description: string;
  detail: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

const roles: RoleCard[] = [
  {
    role: 'shipper',
    icon: '📦',
    title: 'Shipper / Moving Company',
    badge: 'DEMAND',
    description: 'Post full trailer loads and receive competitive bids from verified carriers.',
    detail: 'Moving companies, warehouses, and direct shippers looking to book freight capacity.',
    accentColor: '#fc3f07',
    badgeBg: '#fff0e0',
    badgeText: '#d93506',
  },
  {
    role: 'broker',
    icon: '🤝',
    title: 'Freight Broker',
    badge: 'INTERMEDIARY',
    description: 'Manage multiple loads across your carrier network from a single dashboard.',
    detail: 'Licensed freight brokers handling loads on behalf of multiple shipper clients.',
    accentColor: '#224248',
    badgeBg: '#e6f0f2',
    badgeText: '#224248',
  },
  {
    role: 'carrier',
    icon: '🚚',
    title: 'Carrier / Owner-Operator',
    badge: 'SUPPLY',
    description: 'Browse verified loads, place bids, and post your available trailer capacity.',
    detail: 'Trucking companies, independent owner-operators, and fleet managers with capacity to fill.',
    accentColor: '#2b1508',
    badgeBg: '#f3ede4',
    badgeText: '#7a7168',
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {roles.map((card) => (
            <button
              key={card.role}
              type="button"
              onClick={() => handleSelect(card.role)}
              className="group flex flex-col rounded-2xl border border-[#e8e0d6] bg-white p-8 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fc3f07]"
              style={{ cursor: 'pointer' }}
              aria-label={`Sign up as ${card.title}`}
            >
              {/* Icon + badge row */}
              <div className="mb-5 flex items-start justify-between">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                  style={{ background: card.badgeBg }}
                  aria-hidden="true"
                >
                  {card.icon}
                </span>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]"
                  style={{ background: card.badgeBg, color: card.badgeText }}
                >
                  {card.badge}
                </span>
              </div>

              {/* Title */}
              <h2
                className="mb-2 text-xl font-normal text-neutral-900"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {card.title}
              </h2>

              {/* Primary description */}
              <p className="mb-3 text-sm font-medium leading-relaxed text-neutral-700">
                {card.description}
              </p>

              {/* Detail line */}
              <p className="mb-8 flex-1 text-[13px] leading-relaxed text-neutral-400">
                {card.detail}
              </p>

              {/* CTA row */}
              <div
                className="flex items-center gap-2 text-sm font-semibold transition-colors group-hover:text-[#d93506]"
                style={{ color: card.accentColor }}
              >
                Select &amp; Continue
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
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
