import Link from 'next/link';
import { footerLinks } from '@/lib/navConfig';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <Link href="/" aria-label="FullLoadTrailer home" className="flex items-center gap-2 shrink-0">
            <span
              className="h-7 w-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
              style={{ background: '#224248' }}
              aria-hidden="true"
            >
              FL
            </span>
            <span className="text-base font-semibold tracking-tight text-neutral-900">
              FullLoad<span style={{ color: '#FFCB56' }}>Trailer</span>
            </span>
          </Link>

          <p className="text-sm text-neutral-400 sm:text-right max-w-xs sm:max-w-sm">
            The freight community that keeps deals on-platform — from bulletin board to booked load.
          </p>
        </div>

        <div className="h-px bg-neutral-100 mb-6" />

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-6 text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} FullLoadTrailer. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
