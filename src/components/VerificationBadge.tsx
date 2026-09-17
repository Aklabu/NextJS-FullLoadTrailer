import type { VerificationStatus } from '@/lib/types/auth';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

const badgeConfig: Record<VerificationStatus, { label: string; dot: string; text: string; border: string }> = {
  verified:   { label: 'Verified ✓',      dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200 bg-emerald-50' },
  pending:    { label: 'Pending Review',   dot: 'bg-amber-400',   text: 'text-amber-700',   border: 'border-amber-200 bg-amber-50'   },
  basic:      { label: 'Basic Tier',       dot: 'bg-sky-400',     text: 'text-sky-700',     border: 'border-sky-200 bg-sky-50'       },
  rejected:   { label: 'Action Required',  dot: 'bg-red-400',     text: 'text-red-700',     border: 'border-red-200 bg-red-50'       },
  unverified: { label: 'Unverified',       dot: 'bg-neutral-400', text: 'text-neutral-600', border: 'border-neutral-200 bg-neutral-50'},
};

export default function VerificationBadge({ status, className = '' }: VerificationBadgeProps) {
  const cfg = badgeConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.border} ${cfg.text} ${className}`}
      aria-label={`Verification status: ${cfg.label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
