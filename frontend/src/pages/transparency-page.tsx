import { useEffect, useState } from 'react';
import { StatCard } from '../components/stat-card';
import { TrustBadge } from '../components/trust-badge';
import { usePetStore } from '../features/pets/pet-store';
import { transparencyService } from '../services/transparency-service';
import { formatCurrency, formatDate } from '../utils/format';

export function TransparencyPage() {
  const { organizations, needs } = usePetStore();
  const [remoteRecords, setRemoteRecords] = useState<
    ReturnType<typeof usePetStore.getState>['transparencyRecords']
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void transparencyService
      .list()
      .then((records) => {
        if (!cancelled) {
          setRemoteRecords(records);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Nao foi possivel carregar os registros de transparencia.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const verifiedCount = organizations.filter((org) =>
    ['verified', 'veterinary_verified', 'community_verified'].includes(org.trustLevel),
  ).length;
  const totalTracked = remoteRecords.reduce((sum, record) => sum + record.amountUsed, 0);
  const totalDonations = needs.reduce((sum, need) => sum + need.collectedAmount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="space-y-8">
        <div className="max-w-4xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-sage">
            Transparencia publica
          </p>
          <h1 className="font-display text-5xl text-brand-ink md:text-6xl">
            Confianca se constroi com rastro, contexto e acesso publico.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-brand-muted">
            O MVP expoe verificacao, historico de uso e canal de denuncia para que o cuidado seja
            verificavel, nao apenas bem intencionado.
          </p>
        </div>
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4">
          <StatCard label="ONGs e lares verificados" value={String(verifiedCount)} tone="sky" />
          <StatCard
            label="Doacoes rastreadas"
            value={formatCurrency(totalDonations)}
            tone="warm"
          />
          <StatCard label="Uso publicado" value={formatCurrency(totalTracked)} tone="sage" />
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-white p-6">
          <h2 className="font-display text-3xl text-brand-ink">Como reduzimos fraude</h2>
          <div className="mt-5 grid gap-4">
            {[
              'Selo de confianca no perfil do responsavel e do pet.',
              'Historico publico de necessidades, timeline e prestacao de contas.',
              'Canal de denuncias para pet falso, imagem suspeita e uso indevido.',
              'Contratos documentados e integracao direta com a API Laravel.',
            ].map((item) => (
              <article
                key={item}
                className="rounded-[1.5rem] bg-brand-panel p-4 text-sm leading-6 text-brand-muted"
              >
                {item}
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-3xl text-brand-ink">Registros recentes</h2>
          {loading ? (
            <article className="rounded-[1.75rem] border border-brand-line bg-white p-5 text-sm text-brand-muted">
              Carregando registros...
            </article>
          ) : error ? (
            <article className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
              {error}
            </article>
          ) : (
            remoteRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-[1.75rem] border border-brand-line bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl text-brand-ink">{record.title}</h3>
                    <p className="text-sm text-brand-muted">{record.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-sage-strong">
                      {formatCurrency(record.amountUsed)}
                    </p>
                    <p className="text-sm text-brand-muted">{formatDate(record.date)}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-brand-ink">Responsaveis destacados</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {organizations.map((organization) => (
            <article key={organization.id} className="rounded-[1.75rem] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-2xl text-brand-ink">{organization.name}</h3>
                <TrustBadge level={organization.trustLevel} />
              </div>
              <p className="mt-3 text-sm leading-6 text-brand-muted">{organization.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-brand-muted">
                <span>Score {organization.transparencyScore}/100</span>
                <span>{organization.city}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
