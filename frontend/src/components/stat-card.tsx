export function StatCard({
  label,
  value,
  tone = 'warm',
}: {
  label: string;
  value: string;
  tone?: 'warm' | 'sky' | 'sage';
}) {
  const toneMap = {
    warm: 'bg-brand-orange-soft text-brand-orange-strong',
    sky: 'bg-brand-sky-soft text-brand-sky-strong',
    sage: 'bg-brand-sage-soft text-brand-sage-strong',
  };

  return (
    <article className="min-w-0 overflow-hidden rounded-[1.75rem] border border-brand-line bg-white p-5">
      <div
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneMap[tone]}`}
      >
        {label}
      </div>
      <p className="mt-5 whitespace-nowrap font-display text-3xl tabular-nums text-brand-ink">
        {value}
      </p>
    </article>
  );
}
