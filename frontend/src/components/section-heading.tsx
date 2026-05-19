import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-sage">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl text-brand-ink md:text-4xl">{title}</h2>
        <p className="text-base leading-7 text-brand-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
