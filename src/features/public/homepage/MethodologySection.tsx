// "How It Works" — 3-step process section

function StepCard({ number, icon, title, description }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center text-center sm:max-w-[220px]">
      {/* Number badge + icon row */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-base font-bold text-[#1a2e5a]">
          {number}
        </div>
        <div className="text-[#1a2e5a]">{icon}</div>
      </div>
      <p className="text-base font-bold text-[#1a2e5a]">{title}</p>
      <p className="mt-1.5 text-sm leading-snug text-neutral-500">{description}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden shrink-0 pb-8 sm:flex sm:items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

export default function MethodologySection() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2
          className="text-[clamp(28px,3.5vw,40px)] font-bold text-[#1a2e5a]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          How It Works
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          A simple process for moving companies, carriers, and brokers.
        </p>
      </div>

      {/* Steps row */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-center sm:gap-4">

        <StepCard
          number="1"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-10 w-10" aria-hidden="true">
              <path d="M12 44q-1.65 0-2.825-1.175Q8 41.65 8 40V8q0-1.65 1.175-2.825Q10.35 4 12 4h18.05L40 13.95V40q0 1.65-1.175 2.825Q37.65 44 36 44Zm0-3h24q.2 0 .4-.2.2-.2.2-.8V15.3h-8.3V7H12q-.2 0-.4.2-.2.2-.2.8v32q0 .6.2.8.2.2.4.2Zm6-7h12v-3H18Zm0-7h12v-3H18Zm0-7h7v-3h-7ZM11.6 41V7v34Z" />
            </svg>
          }
          title="Post or Search"
          description="Post a move, post available space, or search for opportunities."
        />

        <Arrow />

        <StepCard
          number="2"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-10 w-10" aria-hidden="true">
              <path d="M4 34.75V10q0-1.25.875-2.125T7 7h34q1.25 0 2.125.875T44 10v22q0 1.25-.875 2.125T41 35H10ZM9.25 32H41V10H7v24.75ZM4 41v-3h20v-4H7q-1.25 0-2.125-.875T4 31v-3h3v3h34V28h3v3q0 1.25-.875 2.125T41 34h-1v4H20v3Z" />
            </svg>
          }
          title="Connect & Negotiate"
          description="Discuss details, submit bids or counteroffers."
        />

        <Arrow />

        <StepCard
          number="3"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-10 w-10" aria-hidden="true">
              <path d="M18 42q-1.25 0-2.125-.875T15 39V9q0-1.25.875-2.125T18 6h3.05q.45-1.3 1.575-2.15T25.15 3q1.5 0 2.625.85T29.35 6H32q1.25 0 2.125.875T35 9v30q0 1.25-.875 2.125T32 42Zm0-3h14V9h-3v4.5H19V9h-1v30Zm7-28.25q.65 0 1.075-.425.425-.425.425-1.075 0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425Q23.5 8.6 23.5 9.25q0 .65.425 1.075.425.425 1.075.425ZM21.5 30.5l8-8-2.1-2.1-5.9 5.9-2.4-2.4-2.1 2.1ZM18 39V9v30Z" />
            </svg>
          }
          title="Confirm & Manage"
          description="Finalize the move and keep all details, documents and tracking together."
        />

      </div>
    </section>
  );
}
