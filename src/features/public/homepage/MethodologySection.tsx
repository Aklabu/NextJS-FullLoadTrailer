const steps = [
  {
    num: '01',
    tag: 'INITIATION',
    tagColor: 'text-[#7a7168] bg-[#f3ede4]',
    title: 'Post or Discover',
    body: 'Broadcast available truck capacity in seconds, or publish structured, biddable household goods move specs with origin, destination, cubic footage, and equipment details.',
    bullets: [
      { color: 'text-[#fc3f07]', text: 'Moving companies: Post jobs or fixed-price moves' },
      { color: 'text-[#fc3f07]', text: 'Carriers: Browse available moves & return capacity' },
    ],
    numBg: 'bg-[#f3ede4] text-[#d93506]',
    active: false,
  },
  {
    num: '02',
    tag: 'NEGOTIATION',
    tagColor: 'text-[#d93506] bg-[#ffe4cc]',
    title: 'Verified Vetting & Counter-Bidding',
    body: 'Real-time FMCSA/DOT authority checks, cargo insurance verification, and structured multi-round counteroffer negotiation — all in-platform, with zero phone tag.',
    bullets: [
      { color: 'text-[#fc3f07]', text: 'USDOT number & active authority verification' },
      { color: 'text-[#fc3f07]', text: 'Sub-14 min average counter-acceptance' },
    ],
    numBg: 'bg-[#fc3f07] text-white',
    active: true,
  },
  {
    num: '03',
    tag: 'EXECUTION',
    tagColor: 'text-[#1e6b5e] bg-[#d4f0ea]',
    title: 'Binding Lock-In & Move Tracking',
    body: 'Digital move confirmation handshake, automated document dispatch, and direct job-linked in-platform messaging with real-time move milestone updates.',
    bullets: [
      { color: 'text-[#fc3f07]', text: 'Automated doc generation & legal binding' },
      { color: 'text-[#fc3f07]', text: 'Anti-disintermediation encrypted chat' },
    ],
    numBg: 'bg-[#f3ede4] text-[#d93506]',
    active: false,
  },
];

export default function MethodologySection() {
  return (
    <section className="bg-[#fdf6ee] px-6 py-16">
      <div className="mx-auto max-w-[1100px]">

        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ece1d3] bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            ⇄ OPERATIONAL METHODOLOGY
          </span>
          <h2
            className="mt-4 text-[clamp(28px,4vw,42px)] font-normal leading-tight text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            From Bulletin to Binding Move Confirmation
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#fc3f07]">
            Three streamlined milestones bridging informal community capacity posts with verified digital marketplace bidding and legally binding move confirmations.
          </p>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`flex flex-col rounded-2xl border p-7 ${
                step.active
                  ? 'border-[#f0c896] bg-white shadow-md'
                  : 'border-[#ece1d3] bg-white/70'
              }`}
            >
              {/* Top row */}
              <div className="mb-5 flex items-center justify-between">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${step.numBg}`}
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {step.num}
                </span>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] ${step.tagColor}`}>
                  {step.tag}
                </span>
              </div>

              {/* Title */}
              <h3
                className="mb-3 text-xl font-normal leading-snug text-neutral-900"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {step.title}
              </h3>

              {/* Body */}
              <p className="mb-6 flex-1 text-sm leading-relaxed text-[#7a7168]">
                {step.body}
              </p>

              {/* Bullets */}
              <ul className="space-y-2">
                {step.bullets.map((b, i) => (
                  <li key={i} className={`flex items-center gap-2 text-xs font-semibold ${b.color}`}>
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fff0e4] text-[10px] text-[#fc3f07]">
                      ✓
                    </span>
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
