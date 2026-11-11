// "How It Works" — 5-step horizontal flow

function StepCard({ number, icon, title, description }: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center text-center sm:max-w-[180px]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#fc3f07]">
        {icon}
      </div>
      <p className="text-sm font-semibold text-gray-900">
        {number}. {title}
      </p>
      <p className="mt-1.5 text-xs leading-snug text-gray-500">{description}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden shrink-0 pb-10 text-gray-300 sm:flex sm:items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

function IconCreateAccount() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-8 w-8" aria-hidden="true">
      <path d="M20 24q-4.15 0-6.575-2.425Q11 19.15 11 15q0-4.15 2.425-6.575Q15.85 6 20 6q4.15 0 6.575 2.425Q29 10.85 29 15q0 4.15-2.425 6.575Q24.15 24 20 24Zm0-3q2.9 0 4.7-1.8 1.8-1.8 1.8-4.2 0-2.9-1.8-4.7Q22.9 8.5 20 8.5q-2.9 0-4.7 1.8-1.8 1.8-1.8 4.7 0 2.4 1.8 4.2Q17.1 21 20 21Zm17 21v-4.5H32.5V33H37v-4.5h3.5V33h4.5v3.5H40.5V41Zm-33 2v-4.65q0-1.55.825-2.775Q5.65 35.35 7 34.65q3.1-1.5 6-2.075Q15.9 32 20 32q.75 0 1.5.05.75.05 1.5.15-.65.9-1.1 1.925Q21.45 35.15 21.2 36.3q-.45-.05-.625-.075Q20.35 36.2 20 36.2q-3.95 0-6.6.6-2.65.6-5.1 1.9-.3.15-.3.5V41Zm16-9.95Z" />
    </svg>
  );
}

function IconPostLoad() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-8 w-8" aria-hidden="true">
      <path d="M12 44q-1.65 0-2.825-1.175Q8 41.65 8 40V8q0-1.65 1.175-2.825Q10.35 4 12 4h18.05L40 13.95V40q0 1.65-1.175 2.825Q37.65 44 36 44Zm0-3h24q.2 0 .4-.2.2-.2.2-.8V15.3h-8.3V7H12q-.2 0-.4.2-.2.2-.2.8v32q0 .6.2.8.2.2.4.2ZM18 35h12v-3H18Zm0-7h12v-3H18Zm0-7h7v-3h-7ZM11.6 41V7v34Z" />
    </svg>
  );
}

function IconConnect() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-8 w-8" aria-hidden="true">
      <path d="M25.1 40.9 14 29.75l2.1-2.1 9 9 14-14 2.15 2.1ZM7.5 25l-3-3 10-10 6 6-2.1 2.15-3.9-3.9Zm26 0-7.9-7.9 2.1-2.15 5.8 5.75 5.9-5.95 2.1 2.15Z" />
    </svg>
  );
}

function IconManageMove() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="h-8 w-8" aria-hidden="true">
      <path d="M4 36v-5.4q0-.65.325-1.225.325-.575.875-.875L8 26.6V16q0-1.25.875-2.125T11 13h18q1.25 0 2.125.875T32 16v4h3.4q.65 0 1.2.3.55.3.9.85l3.5 5.1q.2.3.3.625Q41.4 27.2 41.4 27.6V36h-3q0 1.85-1.325 3.175Q35.75 40.5 33.9 40.5q-1.85 0-3.175-1.325Q29.4 37.85 29.4 36H18.3q0 1.85-1.325 3.175Q15.65 40.5 13.8 40.5q-1.85 0-3.175-1.325Q9.3 37.85 9.3 36ZM11 25h20v-9H11Zm2.8 12.5q.9 0 1.55-.65.65-.65.65-1.55 0-.9-.65-1.55-.65-.65-1.55-.65-.9 0-1.55.65-.65.65-.65 1.55 0 .9.65 1.55.65.65 1.55.65Zm20.1 0q.9 0 1.55-.65.65-.65.65-1.55 0-.9-.65-1.55-.65-.65-1.55-.65-.9 0-1.55.65-.65.65-.65 1.55 0 .9.65 1.55.65.65 1.55.65ZM32 28h7.3l-3.1-4.65q-.05-.05-.125-.2Q36 23 35.9 23H32Zm-21 5h1.2q.65-1 1.675-1.625Q14.9 25.75 16.1 25.75q1.2 0 2.225.625T20 27.75h8.4V16H11Z" />
    </svg>
  );
}

function IconComplete() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

export default function MethodologySection() {
  return (
    <section className="border-b border-gray-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#fc3f07]">
            Simple Process
          </span>
          <h2
            className="text-[clamp(24px,3vw,36px)] font-bold text-gray-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            How It Works
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            A simple process to keep your business moving.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-2">
          <StepCard number={1} icon={<IconCreateAccount />} title="Create Account" description="Register for free as a mover, carrier, or broker." />
          <Arrow />
          <StepCard number={2} icon={<IconPostLoad />} title="Post or Find Loads" description="Share your loads or search available opportunities." />
          <Arrow />
          <StepCard number={3} icon={<IconConnect />} title="Connect & Negotiate" description="Communicate and agree on the details." />
          <Arrow />
          <StepCard number={4} icon={<IconManageMove />} title="Manage the Move" description="Use our tools, driver app, and tracking to stay in control." />
          <Arrow />
          <StepCard number={5} icon={<IconComplete />} title="Complete & Close" description="Confirm delivery and complete the closing sheet (with Tier 2 tools)." />
        </div>
      </div>
    </section>
  );
}
