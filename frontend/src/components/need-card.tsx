import type { Need } from '../types/domain';
import { formatCurrency, formatDate } from '../utils/format';
import { needPriorityLabels, needStatusLabels } from '../utils/labels';

export function NeedCard({ need }: { need: Need }) {
  const progress = Math.min(100, Math.round((need.collectedAmount / need.estimatedAmount) * 100));

  return (
    <article className="rounded-[1.75rem] border border-brand-line bg-white p-5 shadow-[0_12px_35px_rgba(117,97,70,0.06)]">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-orange-soft px-3 py-1 text-xs font-semibold text-brand-orange-strong">
          {needPriorityLabels[need.priority]}
        </span>
        <span className="rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-semibold text-brand-sky-strong">
          {needStatusLabels[need.status]}
        </span>
      </div>
      <h3 className="font-display text-2xl text-brand-ink">{need.title}</h3>
      <p className="mt-2 text-sm leading-6 text-brand-muted">{need.description}</p>
      <div className="mt-5 space-y-2">
        <div className="flex justify-between text-sm text-brand-muted">
          <span>{formatCurrency(need.collectedAmount)} arrecadados</span>
          <span>Meta {formatCurrency(need.estimatedAmount)}</span>
        </div>
        <div className="h-3 rounded-full bg-brand-cream-deep">
          <div
            className="h-3 rounded-full bg-brand-sage"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="mt-4 text-sm text-brand-muted">Prazo: {formatDate(need.dueDate)}</p>
    </article>
  );
}
