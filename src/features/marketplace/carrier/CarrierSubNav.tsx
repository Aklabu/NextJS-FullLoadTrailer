'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { label: 'Browse Loads', href: '/marketplace/carrier/loads' },
  { label: 'My Bids', href: '/marketplace/carrier/my-bids' },
  { label: 'My Capacity', href: '/marketplace/carrier/my-capacity' },
];

export default function CarrierSubNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap gap-1 rounded-2xl border border-[#e8e0d6] bg-white p-1.5 shadow-sm w-fit">
      {LINKS.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: isActive ? '#fc3f07' : 'transparent',
              color: isActive ? '#fff' : '#737373',
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
