import Image from 'next/image';

export default function ContactHero() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ background: '#0F2535', minHeight: 260 }}
    >
      {/* Subtle grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Orange accent line — top */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: '#fc3f07' }} />

      {/* Truck image — covers most of the banner, bleeds to edge */}
      <div className="absolute inset-y-0 right-0 w-[72%] sm:w-[68%]">
        <Image
          src="/images/contact/contact-truck.png"
          alt="Household goods moving truck"
          fill
          className="object-cover object-left"
          priority
        />
        {/* Left fade — shorter so the truck is more visible */}
        <div
          className="absolute inset-y-0 left-0 w-[35%]"
          style={{
            background:
              'linear-gradient(to right, #0F2535 0%, rgba(15,37,53,0.6) 60%, transparent 100%)',
          }}
        />
        {/* Soft right vignette */}
        <div
          className="absolute inset-y-0 right-0 w-[20%]"
          style={{ background: 'linear-gradient(to left, rgba(15,37,53,0.3), transparent)' }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-14 md:py-20">

        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-[11px] font-bold uppercase tracking-widest"
          style={{ background: 'rgba(252,63,7,0.15)', color: '#fc3f07', border: '1px solid rgba(252,63,7,0.3)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#fc3f07' }} />
          FTL Assist
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl font-black leading-none mb-4 tracking-tight"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          <span className="text-white">FTL </span>
          <span
            className="italic"
            style={{
              color: '#fc3f07',
              textShadow: '0 0 40px rgba(252,63,7,0.35)',
            }}
          >
            Assist
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-base sm:text-lg font-medium leading-relaxed max-w-xs sm:max-w-sm"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          Operational Support for<br />
          <span className="font-semibold text-white">Household Goods Movers</span>
        </p>

        {/* Divider line */}
        <div className="mt-6 w-12 h-[3px] rounded-full" style={{ background: '#fc3f07' }} />

      </div>
    </div>
  );
}
