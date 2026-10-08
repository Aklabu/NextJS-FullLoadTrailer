import Link from 'next/link';
import type { QuickAction } from './types';

interface QuickActionCardProps {
  action: QuickAction;
}

export function QuickActionCard({ action }: QuickActionCardProps) {
  const bgClass = action.variant === 'primary' 
    ? 'bg-[#fc3f07] hover:bg-[#d93506] text-white'
    : 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200';

  return (
    <Link
      href={action.href}
      className={`block rounded-lg p-6 transition-colors ${bgClass}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl" role="img" aria-label={action.label}>
          {action.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{action.label}</h3>
          <p className={`mt-1 text-sm ${action.variant === 'primary' ? 'text-white/90' : 'text-neutral-600'}`}>
            {action.description}
          </p>
        </div>
        <span className="text-xl">→</span>
      </div>
    </Link>
  );
}
