import Link from 'next/link';
import { footerLinks } from '@/lib/navConfig';

export default function Footer() {
  return (
    <footer className="w-full" style={{ background: '#1B211A', borderTop: '2px solid #ff3d03' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <Link href="/" aria-label="FullTrailerLoad home" className="flex items-center gap-2 shrink-0">
            <span
              className="h-7 w-7 rounded-md flex items-center justify-center text-xs font-bold"
              style={{ background: '#ff3d03', color: '#1A1953' }}
              aria-hidden="true"
            >
              FL
            </span>
            <span className="text-base font-semibold tracking-tight text-white">
              FullTrailer<span style={{ color: '#ff3d03' }}>Load</span>
            </span>
          </Link>

          <p className="text-sm sm:text-right max-w-xs sm:max-w-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            The freight community that keeps deals on-platform — from bulletin board to booked load.
          </p>
        </div>

        <div className="h-px mb-6" style={{ background: 'rgba(255,203,86,0.25)' }} />

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          &copy; {new Date().getFullYear()} FullTrailerLoad. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
