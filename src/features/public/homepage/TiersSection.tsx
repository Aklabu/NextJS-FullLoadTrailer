import Link from 'next/link';

const tier1Features = [
  'Post load or capacity listings',
  'Browse community board',
  'Verified badge display',
  'Basic contact reveal',
];

const tier2Features = [
  'Everything in Bulletin Board',
  'Structured bidding & counteroffers',
  'Booking confirmations with job IDs',
  'In-platform messaging per job',
  'Carrier capacity postings',
  'Broker pipeline dashboard',
];

export default function TiersSection() {
  return (
    <section
      className="px-6 py-20"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, #f5d9be 0%, #fdf6ee 65%)',
      }}
    >
      <div className="mx-auto max-w-[1100px]">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-[#e8c99a] bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#c2622b]">
            TWO TIERS, ONE PLATFORM
          </span>
          <h2
            className="mt-4 text-[clamp(28px,4vw,40px)] font-normal text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Start free. Upgrade when ready.
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Begin with the bulletin board — no commitment, no card.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Tier 1 — Bulletin Board */}
          <div className="flex flex-col rounded-2xl border border-[#e8e0d6] bg-white/80 p-8">
            <div className="mb-4">
              <span className="rounded-full border border-[#e0d5c8] bg-[#f3ede4] px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] text-[#7a7168]">
                FREE — ALWAYS
              </span>
            </div>

            <h3
              className="mb-2 text-2xl font-normal text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Bulletin Board
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-neutral-500">
              Post and browse informal freight listings. Connect directly with verified peers.
            </p>

            <ul className="mb-8 flex-1 space-y-3">
              {tier1Features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-neutral-700">
                  <svg className="h-4 w-4 shrink-0 text-[#d97b3f]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="block w-full rounded-xl border border-[#e0d5c8] bg-[#f3ede4]/60 py-3 text-center text-sm font-semibold text-neutral-600 transition-colors hover:bg-[#ece2d6]"
            >
              Start for free
            </Link>
          </div>

          {/* Tier 2 — Marketplace */}
          <div className="flex flex-col rounded-2xl border-2 border-[#d97b3f] bg-white p-8 shadow-sm">
            <div className="mb-4">
              <span className="rounded-full border border-[#f0c896] bg-[#fff0e0] px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] text-[#c2622b]">
                TIER 2
              </span>
            </div>

            <h3
              className="mb-2 text-2xl font-normal text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Marketplace
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-neutral-500">
              Full bidding marketplace with structured pricing, counteroffers, and booking confirmations.
            </p>

            <ul className="mb-8 flex-1 space-y-3">
              {tier2Features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-neutral-700">
                  <svg className="h-4 w-4 shrink-0 text-[#d97b3f]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/pricing"
              className="block w-full rounded-xl bg-[#d97b3f] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#c2622b]"
            >
              See pricing
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
