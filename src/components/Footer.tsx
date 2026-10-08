'use client';

import Link from 'next/link';
import Image from 'next/image';
import { footerLinks } from '@/lib/navConfig';

interface FooterProps {
  isLoggedIn?: boolean;
}

export default function Footer({ isLoggedIn = false }: FooterProps) {
  const logoHref = isLoggedIn ? '/dashboard' : '/';
  const logoAriaLabel = isLoggedIn ? 'Go to dashboard' : 'FullTrailerLoad home';
  
  return (
    <footer className="w-full" style={{ background: '#1B211A', borderTop: '2px solid #ff3d03' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <Link href={logoHref} aria-label={logoAriaLabel} className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/logo-icon.png"
              alt=""
              width={36}
              height={36}
              className="rounded-lg"
              aria-hidden="true"
            />
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-extrabold tracking-tight" style={{ fontFamily: 'system-ui, sans-serif' }}>
                <span style={{ color: '#ffffff' }}>FullTrailerLoad</span><span style={{ color: '#ff3d03' }}>.com</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>
                LOADS • BIDS • MOVING • TRANSPORTATION
              </span>
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
