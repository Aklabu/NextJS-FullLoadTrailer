import Link from 'next/link';

// Blue checkmark for Tier 1A and 1B
function BlueCheck() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563eb]" aria-hidden="true">
      <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// Orange checkmark for Tier 2
function OrangeCheck() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fc3f07]" aria-hidden="true">
      <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function TiersSection() {
  return (
    <section className="px-6 py-16" style={{ background: '#eef2fb' }}>
      <div className="mx-auto max-w-[1100px]">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-[clamp(22px,3vw,34px)] font-bold text-[#1a2e5a]">
            Choose the access that fits your business.
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Three levels designed for movers, carriers, and moving brokers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Tier 1A — Free Bulletin Board */}
          <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
            {/* Badge */}
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-[#9ca3af] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              TIER 1A
            </span>
            <h3 className="text-xl font-bold text-[#1a2e5a]">Free Bulletin Board</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1a2e5a]">$0</span>
              <span className="text-sm text-neutral-500">Get started free</span>
            </div>

            <ul className="mb-8 mt-5 flex-1 space-y-3">
              {[
                'Limited listings and access',
                'Basic load and capacity announcements',
                'Browse opportunities',
                'Entry point to the community',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <BlueCheck />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="mt-auto block w-full rounded-xl border-2 border-[#1a2e5a] py-3 text-center text-sm font-bold text-[#1a2e5a] transition-colors hover:bg-[#1a2e5a] hover:text-white"
            >
              Get Started Free →
            </Link>
          </div>

          {/* Tier 1B — Bulletin Plus */}
          <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
            {/* Badge */}
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-[#2563eb] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              TIER 1B
            </span>
            <h3 className="text-xl font-bold text-[#1a2e5a]">Bulletin Plus</h3>
            <p className="mt-1 text-sm text-neutral-500">Low monthly fee</p>

            <ul className="mb-8 mt-5 flex-1 space-y-3">
              {[
                'Higher listing and browsing limits',
                'More opportunities to connect',
                'Post both loads and available capacity',
                'Priority placement',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <BlueCheck />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup?tier=1b"
              className="mt-auto block w-full rounded-xl bg-[#2563eb] py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Upgrade to Bulletin Plus →
            </Link>
          </div>

          {/* Tier 2 — Full Marketplace */}
          <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
            {/* Badge */}
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-[#fc3f07] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              TIER 2
            </span>
            <h3 className="text-xl font-bold text-[#1a2e5a]">Full Marketplace</h3>
            <p className="mt-1 text-sm text-neutral-500">Premium access</p>

            <ul className="mb-8 mt-5 flex-1 space-y-3">
              {[
                'All Bulletin Plus features',
                'Structured load listings and matching',
                'Bids and counteroffers',
                'Messaging and job confirmations',
                'Additional business tools',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <OrangeCheck />
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
