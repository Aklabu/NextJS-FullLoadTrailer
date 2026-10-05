import type { UserRole } from '@/lib/types/auth';

export interface NavItem {
  label: string;
  href: string;
  roles?: UserRole[];
}

// Logged-out centre links
export const publicNavItems: NavItem[] = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
];

// Logged-in centre links
export const authedNavItems: NavItem[] = [
  { label: 'Board', href: '/board' },
  { label: 'Community', href: '/community' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Messages', href: '/messages' },
];

// Profile dropdown items (same for all roles)
export const profileDropdownItems: NavItem[] = [
  { label: 'My Profile / Settings', href: '/profile' },
  { label: 'Subscription & Upgrade', href: '/subscription' },
];

// Footer links
export const footerLinks: NavItem[] = [
  { label: 'Track Shipment', href: '/tracking' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

// Resolves the correct marketplace landing URL per role
export function getMarketplaceHref(role: UserRole): string {
  if (role === 'carrier') return '/marketplace/loads';
  return '/marketplace/my-loads';
}
