const services = [
  {
    label: 'Dispatch\nSupport',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Job & Driver\nManagement',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Route\nPlanning',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" />
        <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Closing\nSheets',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h2l1 1 1-1h2" />
      </svg>
    ),
  },
  {
    label: 'Operational\nCoordination',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="9" cy="7" r="2" />
        <circle cx="15" cy="7" r="2" />
        <circle cx="12" cy="14" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v1a3 3 0 006 0V9M12 16v2" />
      </svg>
    ),
  },
];

export default function ServicesStrip() {
  return (
    <div className="w-full border-b" style={{ background: '#fff', borderColor: '#e5e7eb' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 divide-x divide-[#e5e7eb]">
          {services.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center gap-2 py-5 px-2 text-center"
            >
              <span style={{ color: '#1B3A4B' }}>{s.icon}</span>
              <span
                className="text-xs sm:text-sm font-semibold leading-tight whitespace-pre-line"
                style={{ color: '#1B3A4B' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
