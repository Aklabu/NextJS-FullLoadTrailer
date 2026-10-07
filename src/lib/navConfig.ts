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
// Note: Marketplace href is role-resolved at render time via getMarketplaceHref(role) in NavbarClient.
// The href here is a fallback only and should never be used directly.
export const authedNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Community', href: '/community' },
  { label: 'Marketplace', href: '/marketplace/my-loads' },
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
  if (role === 'carrier') return '/marketplace/carrier/loads';
  return '/marketplace/my-loads';
}
