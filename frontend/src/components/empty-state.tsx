export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-brand-line bg-white p-8 text-center">
      <h3 className="font-display text-2xl text-brand-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-brand-muted">{description}</p>
    </div>
  );
}
