import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/empty-state';
import { SectionHeading } from '../components/section-heading';
import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import {
  sponsorshipService,
  type SupportCreationPayload,
  type SupportTransactionView,
  type SupportView,
} from '../services/sponsorship-service';
import { formatCurrency, formatDate } from '../utils/format';

type TargetType = 'pet' | 'organization';

const isTargetType = (value: string | null): value is TargetType =>
  value === 'pet' || value === 'organization';

export function SupportsPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { pets, organizations } = usePetStore();
  const [searchParams] = useSearchParams();
  const initialTargetType = searchParams.get('targetType');
  const [supports, setSupports] = useState<SupportView[]>([]);
  const [transactions, setTransactions] = useState<SupportTransactionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetType, setTargetType] = useState<TargetType>(
    isTargetType(initialTargetType) ? initialTargetType : 'pet',
  );
  const [targetId, setTargetId] = useState(searchParams.get('targetId') ?? pets[0]?.id ?? organizations[0]?.id ?? '');
  const [monthlyAmount, setMonthlyAmount] = useState('50');
  const [submitting, setSubmitting] = useState(false);

  const supportTargets = useMemo(
    () => ({
      pet: pets,
      organization: organizations,
    }),
    [organizations, pets],
  );

  useEffect(() => {
    let cancelled = false;

    void Promise.all([sponsorshipService.mySupports(), sponsorshipService.myTransactions()])
      .then(([remoteSupports, remoteTransactions]) => {
        if (cancelled) {
          return;
        }

        setSupports(remoteSupports);
        setTransactions(remoteTransactions);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedTargetId = useMemo(() => {
    const options = supportTargets[targetType];

    if (options.length === 0) {
      return '';
    }

    return options.some((entry) => entry.id === targetId) ? targetId : options[0].id;
  }, [supportTargets, targetId, targetType]);

  const resolveTargetLabel = (support: { targetType: TargetType; targetId: string }) => {
    if (support.targetType === 'pet') {
      const pet = pets.find((entry) => entry.id === support.targetId);
      return pet ? `${pet.name} - pet` : `Pet #${support.targetId}`;
    }

    const organization = organizations.find((entry) => entry.id === support.targetId);
    return organization ? `${organization.name} - ONG` : `ONG #${support.targetId}`;
  };

  const resolveSupportStatusLabel = (status: SupportView['status']) => {
    const labels: Record<SupportView['status'], string> = {
      pending_checkout: 'Aguardando checkout',
      active: 'Ativo',
      paused: 'Pausado',
      payment_failed: 'Falha no pagamento',
      canceled: 'Cancelado',
    };

    return labels[status] ?? status;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload: SupportCreationPayload = {
        targetType,
        targetId: selectedTargetId,
        monthlyAmount: Number(monthlyAmount),
        sponsorName: currentUser?.name,
      };

      const createdSupport = await sponsorshipService.createSupport(payload);
      setSupports((state) => [createdSupport.support, ...state]);

      if (createdSupport.checkoutUrl) {
        window.location.assign(createdSupport.checkoutUrl);
        return;
      }

      setTransactions(await sponsorshipService.myTransactions());
    } finally {
      setSubmitting(false);
    }
  };

  const handlePause = async (supportId: string) => {
    await sponsorshipService.pauseSupport(supportId);
    setSupports(await sponsorshipService.mySupports());
  };

  const handleResume = async (supportId: string) => {
    await sponsorshipService.resumeSupport(supportId);
    setSupports(await sponsorshipService.mySupports());
  };

  const handleCancel = async (supportId: string) => {
    await sponsorshipService.cancelSupport(supportId);
    setSupports(await sponsorshipService.mySupports());
  };

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Entre para apoiar"
          description="Com acesso demo, voce escolhe um pet ou uma ONG, define um valor mensal e acompanha tudo por aqui."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Carregando apoios"
          description="Estamos sincronizando seus apoios recorrentes e o historico de cobrancas."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="space-y-5">
        <SectionHeading
          eyebrow="Apoios"
          title="Escolha um pet ou uma ONG e acompanhe o apoio recorrente."
          description="A ajuda nao fica esquecida. Voce define o valor mensal, pausa quando quiser e revisa o uso do dinheiro dentro do app."
        />
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          className="space-y-4 rounded-[2rem] bg-white p-6"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <h2 className="font-display text-3xl text-brand-ink">Novo apoio recorrente</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="h-12 rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage"
              value={targetType}
              onChange={(event) => setTargetType(event.target.value as TargetType)}
            >
              <option value="pet">Pet</option>
              <option value="organization">ONG</option>
            </select>
            <select
              className="h-12 rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage"
              value={selectedTargetId}
              onChange={(event) => setTargetId(event.target.value)}
              disabled={supportTargets[targetType].length === 0}
            >
              {supportTargets[targetType].map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>
          <input
            className="h-12 w-full rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage"
            min="1"
            step="0.01"
            type="number"
            value={monthlyAmount}
            onChange={(event) => setMonthlyAmount(event.target.value)}
          />
          <button
            className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-strong disabled:opacity-60"
            disabled={submitting || supportTargets[targetType].length === 0}
            type="submit"
          >
            {submitting ? 'Salvando...' : 'Ativar apoio mensal'}
          </button>
          <p className="text-sm leading-6 text-brand-muted">
            Ao ativar, o app registra o apoio como recorrente, mostra a proxima cobranca e adiciona o
            historico simbolico para transparencia.
          </p>
        </form>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6">
            <h2 className="font-display text-3xl text-brand-ink">Meus apoios</h2>
            <div className="mt-5 space-y-4">
              {supports.length === 0 ? (
                <EmptyState
                  title="Sem apoios ativos"
                  description="Ative um apoio recorrente para pet ou ONG e acompanhe a cobrança mensal daqui."
                />
              ) : (
                supports.map((support) => (
                  <article key={support.id} className="rounded-[1.5rem] bg-brand-panel p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-brand-muted">
                          {support.targetType === 'pet' ? 'Pet' : 'ONG'}
                        </p>
                        <h3 className="font-semibold text-brand-ink">
                          {resolveTargetLabel(support)}
                        </h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-ink">
                        {resolveSupportStatusLabel(support.status)}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-brand-muted sm:grid-cols-2">
                      <p>Valor mensal: {formatCurrency(support.monthlyAmount)}</p>
                      <p>Proxima cobranca: {formatDate(support.nextBillingAt)}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {support.status === 'active' ? (
                        <button
                          className="rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-ink"
                          onClick={() => {
                            void handlePause(support.id);
                          }}
                          type="button"
                        >
                          Pausar
                        </button>
                      ) : support.status === 'paused' ? (
                        <button
                          className="rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-ink"
                          onClick={() => {
                            void handleResume(support.id);
                          }}
                          type="button"
                        >
                          Retomar
                        </button>
                      ) : null}
                      {support.status !== 'canceled' ? (
                        <button
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                          onClick={() => {
                            void handleCancel(support.id);
                          }}
                          type="button"
                        >
                          Cancelar
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6">
            <h2 className="font-display text-3xl text-brand-ink">Historico de cobrancas</h2>
            <div className="mt-5 space-y-4">
              {transactions.length === 0 ? (
                <EmptyState
                  title="Sem cobranças registradas"
                  description="Quando o apoio estiver ativo, as cobranças mensais simbolicas aparecem aqui."
                />
              ) : (
                transactions.map((transaction) => (
                  <article key={transaction.id} className="rounded-[1.5rem] bg-brand-panel p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-brand-muted">{resolveTargetLabel(transaction)}</p>
                        <h3 className="font-semibold text-brand-ink">Cobrança recorrente</h3>
                      </div>
                      <span className="font-semibold text-brand-sage-strong">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-brand-muted">
                      <span>{transaction.paymentMethod}</span>
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <Link className="text-sm font-semibold text-brand-sage-strong" to="/transparency">
          Ver transparencia publica
        </Link>
      </section>
    </div>
  );
}
