const testimonials = [
  {
    initials: 'MK',
    stars: 5,
    quote:
      '"The difference between traditional static boards and FullTrailerLoad Tier 2 is night and day. We trimmed our time-to-cover from 2.5 hours down to 18 minutes, and every counteroffer is locked with vetted paperwork."',
    name: 'Marcus Keller',
    role: 'Director of Freight Operations · Apex Freight Logistics',
  },
  {
    initials: 'DR',
    stars: 5,
    quote:
      '"As an owner-operator running Midwest-to-Southwest lanes, I can post my return capacity straight from the cab. No mystery brokers, no ghost loads. When a shipper counters, we agree and book right on the screen."',
    name: 'Darren Reynolds',
    role: 'Owner-Operator · Red Rock Hauling LLC (3 Trucks)',
  },
];

export default function TrustSection() {
  return (
    <section className="bg-[#fdf6ee] px-6 pb-20 pt-4">
      <div className="mx-auto max-w-[1100px] space-y-6">

        {/* FMCSA validation banner */}
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-[#ece1d3] bg-white px-6 py-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d97b3f] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <span className="text-base font-semibold text-neutral-900">
                  Integrated FMCSA &amp; DOT Validation
                </span>
                <span className="rounded-full bg-[#d4f0ea] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[1px] text-[#1e6b5e]">
                  REAL-TIME VETTING
                </span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-neutral-500">
                Every carrier must maintain valid operating authority, $1M auto liability, and cargo insurance minimums before bidding on Tier 2 loads.
              </p>
            </div>
          </div>

          {/* Verification pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { dot: 'bg-green-500', label: 'DOT Verified' },
              { dot: 'bg-[#d97b3f]', label: 'MC Validated' },
              { dot: 'bg-[#c2622b]', label: 'COI Checked' },
            ].map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#ece1d3] bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700"
              >
                <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-[#ece1d3] bg-white p-7"
            >
              {/* Stars */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f0d9a8] bg-[#fef9ec] px-3 py-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 text-[#d97b3f]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-[#c2622b]">{t.stars}.0 Verified</span>
              </div>

              {/* Quote */}
              <p
                className="mb-6 flex-1 text-[15px] italic leading-relaxed text-neutral-700"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d97b3f] text-xs font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                  <div className="text-xs text-[#d97b3f]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
