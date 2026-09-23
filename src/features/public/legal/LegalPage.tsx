// Shared layout for Terms of Service and Privacy Policy.
// Content is passed as sections — easy to replace with CMS data later.

interface Section {
  heading: string;
  body: string;
}

interface LegalPageProps {
  badge: string;
  title: string;
  effectiveDate: string;
  intro: string;
  sections: Section[];
}

export default function LegalPage({ badge, title, effectiveDate, intro, sections }: LegalPageProps) {
  return (
    <div className="bg-[#fdf6ee] py-16">
      <div className="mx-auto max-w-[720px] px-6">

        {/* Header */}
        <div className="mb-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />
            {badge}
          </span>
          <h1
            className="mt-4 text-[clamp(28px,4vw,40px)] font-normal leading-tight text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {title}
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Effective date: <span className="font-medium text-neutral-700">{effectiveDate}</span>
          </p>


        </div>

        {/* Intro */}
        <p className="mb-8 text-sm leading-relaxed text-neutral-600">{intro}</p>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i} aria-labelledby={`section-${i}`}>
              <h2
                id={`section-${i}`}
                className="mb-3 text-base font-semibold text-neutral-900"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {i + 1}. {s.heading}
              </h2>
              <p className="text-sm leading-[1.8] text-neutral-600">{s.body}</p>
            </section>
          ))}
        </div>

        {/* Contact footer */}
        <div className="mt-12 rounded-2xl border border-[#e8e0d6] bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-neutral-600">
            Questions about this document? Contact us at{' '}
            <a href="mailto:legal@fullloadtrailer.com" className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
              legal@fullloadtrailer.com
            </a>
            {' '}or visit our{' '}
            <a href="/contact" className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
              contact page
            </a>.
          </p>
        </div>

      </div>
    </div>
  );
}
