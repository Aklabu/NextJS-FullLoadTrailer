const stats = [
  { value: '$48M+', label: 'FREIGHT VALUE HANDLED' },
  { value: '12,500+', label: 'VERIFIED CARRIERS' },
  { value: '< 14 min', label: 'AVG. TIME-TO-BID' },
  { value: '99.8%', label: 'ON-TIME EXECUTION' },
];

export default function StatsBar() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-6 pt-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#ece1d3] bg-white px-6 py-5 text-center"
          >
            <span
              className="font-serif text-[clamp(22px,3vw,28px)] font-normal leading-tight text-[#d97b3f]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {s.value}
            </span>
            <span className="mt-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#9ca3af]">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
