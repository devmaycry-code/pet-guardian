import type { TrustLevel } from '../types/domain';
import { trustLabels } from '../utils/labels';

const trustTone: Record<TrustLevel, string> = {
  not_verified: 'bg-stone-200 text-stone-700',
  pending: 'bg-sky-100 text-sky-700',
  community_verified: 'bg-emerald-100 text-emerald-700',
  verified: 'bg-sky-200 text-sky-800',
  veterinary_verified: 'bg-emerald-200 text-emerald-800',
  under_review: 'bg-amber-100 text-amber-700',
  suspended: 'bg-rose-100 text-rose-700',
};

export function TrustBadge({ level }: { level: TrustLevel }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${trustTone[level]}`}
    >
      {trustLabels[level]}
    </span>
  );
}
