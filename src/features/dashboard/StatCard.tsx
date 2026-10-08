import type { StatCardProps } from './types';

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{value}</p>
        </div>
        {icon && (
          <div className="text-2xl" role="img" aria-label={label}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
