import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found — FullLoadTrailer',
};

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{
        background:
          'radial-gradient(circle at 20% 10%, #fbe3c4, transparent 50%), radial-gradient(circle at 85% 20%, #f6d9d3, transparent 50%), #fdf6ee',
      }}
    >
      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-2" aria-label="FullLoadTrailer home">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
          style={{ background: '#FFCB56', color: '#1A1953' }}
          aria-hidden="true"
        >
          FL
        </span>
        <span className="text-lg font-semibold tracking-tight text-neutral-900">
          FullLoad<span style={{ color: '#fc3f07' }}>Trailer</span>
        </span>
      </Link>

      {/* 404 graphic */}
      <div
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl text-4xl"
        style={{ background: '#f3ede4' }}
        aria-hidden="true"
      >
        🚚
      </div>

      {/* Headline */}
      <h1
        className="mb-3 text-[clamp(28px,5vw,48px)] font-normal leading-tight text-neutral-900"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        This load went{' '}
        <span className="italic" style={{ color: '#fc3f07' }}>
          off-route
        </span>
      </h1>

      <p className="mb-2 text-lg font-semibold text-neutral-400">404 — Page not found</p>

      <p className="mb-10 max-w-md text-sm leading-relaxed text-neutral-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Let&apos;s get you back on track.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          style={{ background: '#fc3f07' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Back to homepage
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl border border-[#e0d5c8] bg-white px-6 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
        >
          Go to dashboard
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium text-neutral-400 underline underline-offset-2 hover:text-neutral-600 transition-colors"
        >
          Contact support
        </Link>
      </div>

      {/* Bottom note */}
      <p className="mt-12 text-xs text-neutral-400">
        If you followed a link that should work,{' '}
        <Link href="/contact" className="text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
          let us know
        </Link>
        .
      </p>
    </div>
  );
}
