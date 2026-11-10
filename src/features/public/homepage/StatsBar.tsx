// Feature highlights bar — replaces numeric stats
const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9" aria-hidden="true">
        <path d="M12 2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v1h6V7a3 3 0 0 0-3-3z" />
        <rect x="9" y="13" width="6" height="4" rx="1" />
      </svg>
    ),
    title: 'Full, Partial\n& Return Loads',
    description: 'Maximize trailer\nspace',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9" aria-hidden="true">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    title: 'Built for\nHousehold Goods',
    description: 'Designed for real\nmoving jobs',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z" />
      </svg>
    ),
    title: 'Verified\nBusinesses',
    description: 'Work with trusted\npartners',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9" aria-hidden="true">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    title: 'Three User Types',
    description: 'Moving companies,\ncarriers and\nmoving brokers',
  },
];
export default function StatsBar() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-6 pt-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center justify-start border border-[#ece1d3] bg-white px-6 py-5 text-center"
          >
            <div className="mb-3 text-[#1a2e5a]">{f.icon}</div>
            <p className="mb-1.5 text-sm font-bold leading-snug text-[#1a2e5a]" style={{ whiteSpace: 'pre-line' }}>
              {f.title}
            </p>
            <p className="text-sm leading-snug text-neutral-500" style={{ whiteSpace: 'pre-line' }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
