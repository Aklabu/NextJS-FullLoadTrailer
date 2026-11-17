export default function PricingStrip() {
  return (
    // Outer wrapper — white bg matches the page
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8" style={{ background: '#fff' }}>
      {/* Inner card — peach/cream rounded rectangle */}
      <div
        className="mx-auto max-w-4xl rounded-2xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-5"
        style={{ background: '#FEF0E6', border: '1px solid #FDDCC4' }}
      >
        {/* Left: badge + divider + text */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Hexagonal % badge */}
          <div className="relative shrink-0 flex items-center justify-center w-14 h-14">
            {/* Starburst / badge shape via clip-path */}
            <div
              className="absolute inset-0 rounded-xl rotate-12"
              style={{ background: '#fc3f07' }}
            />
            <div
              className="absolute inset-0 rounded-xl -rotate-12"
              style={{ background: '#fc3f07' }}
            />
            <span className="relative text-xl font-black text-white z-10">%</span>
          </div>

          {/* Vertical divider */}
          <div className="hidden sm:block w-px self-stretch" style={{ background: '#FBBF99' }} />

          {/* Text */}
          <div>
            <p className="text-base sm:text-lg font-bold" style={{ color: '#1a1a1a' }}>
              FTL Assist is a flat percentage.
            </p>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
              Pricing depends on your fleet size and workload.
            </p>
          </div>
        </div>

        {/* Right: Call for Pricing button */}
        <a
          href="tel:18005550000"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 shrink-0 w-full sm:w-auto justify-center"
          style={{ background: '#fc3f07' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Call for Pricing
        </a>
      </div>
    </div>
  );
}
