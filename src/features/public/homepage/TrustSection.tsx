import Image from 'next/image';
import Link from 'next/link';

// Trust & Safety icon helpers
function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className="text-[#1a2e5a]">{icon}</div>
      <span className="text-xs font-semibold text-[#1a2e5a] leading-tight">{label}</span>
    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="bg-[#fdf6ee] px-6 pb-20 pt-4">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Left panel — Mobile App for Drivers */}
          <div className="flex items-center gap-6 rounded-2xl border border-[#dce8f7] bg-[#edf4fc] px-6 py-6">
            {/* Phone mockup image */}
            <div className="shrink-0">
              <Image
                src="/images/homepage/ftl-app.jpeg"
                alt="FTL mobile app showing My Jobs screen"
                width={130}
                height={160}
                className="rounded-xl object-cover"
              />
            </div>

            {/* Text + CTA */}
            <div>
              <h3 className="text-lg font-extrabold text-[#1a2e5a] leading-tight mb-2">
                Mobile App for Drivers
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                Drivers can see their assigned jobs, get directions, update status, upload photos, and provide signatures — all from their phone.
              </p>
              {/* App store buttons */}
              <div className="flex flex-wrap gap-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Download on the App Store"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] leading-none opacity-80">Download on the</div>
                    <div className="text-xs font-semibold leading-tight">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Get it on Google Play"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
                    <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.72-2.72zm16.3-10.03L16.76 12l2.72-1.73L22 12zm-3.56-2.05L3.18.24A1.14 1.14 0 0 0 2.2.44L14.17 12zm-12.74 1.1L14.17 12 2.2 23.56a1.14 1.14 0 0 1-.98-.2 1.14 1.14 0 0 1-.5-.97V12.78z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] leading-none opacity-80">GET IT ON</div>
                    <div className="text-xs font-semibold leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right panel — Trust & Safety */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#dce8f7] bg-[#edf4fc] px-6 py-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                {/* Shield icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a2e5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <h3 className="text-lg font-extrabold text-[#1a2e5a]">Trust &amp; Safety</h3>
              </div>
              <p className="text-sm text-neutral-600 mb-6">
                A safer, more reliable marketplace for household moving.
              </p>

              {/* 4 trust icons */}
              <div className="grid grid-cols-4 gap-3">
                <TrustItem
                  label="Verified Companies"
                  icon={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a2e5a]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6" aria-hidden="true">
                        <path fillRule="evenodd" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" clipRule="evenodd" />
                      </svg>
                    </div>
                  }
                />
                <TrustItem
                  label="Identity & DOT Checks"
                  icon={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a2e5a]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  }
                />
                <TrustItem
                  label="Secure Transactions"
                  icon={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a2e5a]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  }
                />
                <TrustItem
                  label="Report an Issue"
                  icon={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a2e5a]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                      </svg>
                    </div>
                  }
                />
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1a2e5a] px-5 py-2.5 text-sm font-bold text-[#1a2e5a] hover:bg-[#1a2e5a] hover:text-white transition-colors"
              >
                Learn More About Trust &amp; Safety
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
