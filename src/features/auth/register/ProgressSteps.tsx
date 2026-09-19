import type { Step } from './useRegistrationForm';

const STEPS: { n: Step; label: string; icon: string }[] = [
  { n: 1, label: 'Company', icon: '🏢' },
  { n: 2, label: 'Role & Tier', icon: '📋' },
  { n: 3, label: 'Documents', icon: '📎' },
  { n: 4, label: 'Password', icon: '🔒' },
];

interface ProgressStepsProps {
  current: Step;
}

export default function ProgressSteps({ current }: ProgressStepsProps) {
  return (
    <div className="mb-8 flex items-start" role="list" aria-label="Registration steps">
      {STEPS.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;

        return (
          <div key={s.n} className="flex flex-1 flex-col items-center" role="listitem">
            <div className="flex w-full items-center">
              {/* Left connector */}
              {i > 0 && (
                <div
                  className="h-0.5 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: current > s.n - 1 ? '#d97b3f' : '#e8e0d6' }}
                  aria-hidden="true"
                />
              )}

              {/* Circle */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300"
                style={{
                  background: done ? '#d97b3f' : active ? '#2b1508' : '#f3ede4',
                  color: done || active ? '#fff' : '#a09080',
                  boxShadow: active ? '0 0 0 4px rgba(217,123,63,0.15)' : 'none',
                }}
                aria-current={active ? 'step' : undefined}
              >
                {done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span aria-hidden="true">{s.n}</span>
                )}
              </div>

              {/* Right connector */}
              {i < STEPS.length - 1 && (
                <div
                  className="h-0.5 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: current > s.n ? '#d97b3f' : '#e8e0d6' }}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Label */}
            <span
              className="mt-2 text-[11px] font-medium text-center transition-colors duration-200"
              style={{ color: active ? '#2b1508' : done ? '#d97b3f' : '#a09080' }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
