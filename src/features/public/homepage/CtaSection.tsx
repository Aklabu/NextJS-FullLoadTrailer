import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="bg-[#fdf6ee] px-6 pb-16 pt-4">
      <div
        className="relative mx-auto max-w-[1100px] overflow-hidden rounded-2xl px-10 py-14"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(180,80,10,0.55) 0%, transparent 70%), #2b1508',
        }}
      >
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fc3f07]" />
            STEP INTO MODERN MOVING
          </span>
        </div>

        {/* Headline */}
        <h2
          className="mb-4 max-w-2xl text-[clamp(28px,4vw,42px)] font-normal leading-tight text-white"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Ready to modernize your moving business?
        </h2>

        {/* Subtext */}
        <p className="mb-10 max-w-md text-sm leading-relaxed text-white/60">
          Join thousands of moving companies, household goods brokers, and verified carriers connecting in real time — with guaranteed transparency.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/auth/signup?role=shipper"
            className="inline-flex items-center gap-2 rounded-lg bg-[#fc3f07] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            I need a mover (Moving Company / Broker)
          </Link>

          <Link
            href="/auth/signup?role=carrier"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/20 border border-white/15"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-.293-.707l-3-3A1 1 0 0016 5h-1V4a1 1 0 00-1-1H3zm11 5h-1V7h.586L15 8.414V9z" />
            </svg>
            I have moving trucks (Carrier / Owner-Operator)
          </Link>
        </div>
      </div>
    </section>
  );
}
