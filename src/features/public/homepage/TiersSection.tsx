import Link from 'next/link';

function Check({ variant }: { variant: 'muted' | 'dark' | 'orange' }) {
  const bg = variant === 'muted' ? 'bg-gray-300' : variant === 'dark' ? 'bg-gray-900' : 'bg-[#fc3f07]';
  return (
    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${bg}`} aria-hidden="true">
      <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function TiersSection() {
  return (
    <section className="border-b border-gray-200 bg-[#F9FAFB] px-6 py-16">
      <div className="mx-auto max-w-[1100px]">

        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#fc3f07]">
            Pricing & Access
          </span>
          <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-gray-900">
            Choose the access that fits your business.
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Three levels designed for movers, carriers, and moving brokers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Tier 1A */}
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
            <span className="mb-5 inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
              TIER 1A · FREE
            </span>
            <h3 className="text-xl font-bold text-gray-900">Bulletin Board</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">$0</span>
              <span className="text-sm text-gray-400">forever free</span>
            </div>
            <ul className="mb-8 mt-6 flex-1 space-y-3">
              {[
                'Limited listings and access',
                'Basic load and capacity announcements',
                'Browse opportunities',
                'Entry point to the community',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Check variant="muted" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="mt-auto block w-full rounded-xl border-2 border-gray-900 py-3 text-center text-sm font-bold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            >
              Get Started Free →
            </Link>
          </div>

          {/* Tier 1B — featured */}
          <div className="relative flex flex-col rounded-2xl bg-gray-900 p-7 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-[#fc3f07] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                MOST POPULAR
              </span>
            </div>
            <span className="mb-5 inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white/80">
              TIER 1B
            </span>
            <h3 className="text-xl font-bold text-white">Bulletin Plus</h3>
            <p className="mt-1 text-sm text-white/50">Low monthly fee</p>
            <ul className="mb-8 mt-6 flex-1 space-y-3">
              {[
                'Higher listing and browsing limits',
                'More opportunities to connect',
                'Post both loads and available capacity',
                'Priority placement',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                  <Check variant="dark" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup?tier=1b"
              className="mt-auto block w-full rounded-xl bg-[#fc3f07] py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#d93506]"
            >
              Upgrade to Bulletin Plus →
            </Link>
          </div>

          {/* Tier 2 */}
          <div className="flex flex-col rounded-2xl border border-orange-100 bg-white p-7 shadow-sm">
            <span className="mb-5 inline-flex w-fit items-center rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#fc3f07]">
              TIER 2 · PREMIUM
            </span>
            <h3 className="text-xl font-bold text-gray-900">Full Marketplace</h3>
            <p className="mt-1 text-sm text-gray-400">Premium access</p>
            <ul className="mb-8 mt-6 flex-1 space-y-3">
              {[
                'All Bulletin Plus features',
                'Structured load listings and matching',
                'Bids and counteroffers',
                'Messaging and job confirmations',
                'Additional business tools',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Check variant="orange" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup?tier=2"
              className="mt-auto block w-full rounded-xl bg-[#fc3f07] py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#d93506]"
            >
              Upgrade to Tier 2 →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
