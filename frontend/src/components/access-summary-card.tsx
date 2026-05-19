import type { UserRole } from '../types/domain';
import { roleCapabilities, roleLabels } from '../utils/access';

export function AccessSummaryCard({
  title,
  role,
}: {
  title: string;
  role: UserRole | 'visitor';
}) {
  const items =
    role === 'visitor'
      ? [
          'Ver home, listagem de pets, perfis e transparencia',
          'Entender sinais de verificacao e antifraude',
          'Abrir o acesso demo para virar Pawdrinho ou gestor',
          'Enviar denuncia pela area publica',
        ]
      : roleCapabilities[role];

  const roleTitle = role === 'visitor' ? 'Visitante' : roleLabels[role];

  return (
    <article className="min-w-0 rounded-[1.75rem] border border-brand-line bg-white p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-sage">{title}</p>
      <h3 className="mt-3 break-words font-display text-2xl leading-tight text-brand-ink">
        {roleTitle}
      </h3>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <p
            key={item}
            className="rounded-2xl bg-brand-panel px-4 py-3 text-sm leading-6 text-brand-muted"
          >
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
