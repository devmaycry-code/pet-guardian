import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/empty-state';
import { LetterCard } from '../components/letter-card';
import { NeedCard } from '../components/need-card';
import { TimelineCard } from '../components/timeline-card';
import { TrustBadge } from '../components/trust-badge';
import { useAuthStore } from '../features/auth/auth-store';
import { followService } from '../services/follow-service';
import { petsService, type PetProfileData } from '../services/pets-service';
import { canFollowPets } from '../utils/access';
import { formatCurrency, formatDate } from '../utils/format';
import { petStatusLabels } from '../utils/labels';

export function PetProfilePage() {
  const { slug } = useParams();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [following, setFollowing] = useState(false);
  const [profile, setProfile] = useState<PetProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const followedPetIds = currentUser?.followedPetIds ?? [];

  useEffect(() => {
    if (!slug) {
      return;
    }

    setLoading(true);
    setError(null);
    let cancelled = false;

    void petsService
      .profile(slug)
      .then((result) => {
        if (!cancelled) {
          setProfile(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Nao foi possivel carregar o perfil deste pet.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Carregando perfil do pet"
          description="Estamos buscando os dados publicos, a timeline e a transparencia deste pet."
        />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Pet nao encontrado"
          description={error ?? 'O perfil solicitado nao esta mais disponivel ou ainda nao foi publicado.'}
        />
      </div>
    );
  }

  const data = profile;
  const isFollowing = followedPetIds.includes(data.pet.id);

  const handleFollowToggle = async () => {
    setFollowing(true);
    if (isFollowing) {
      await followService.unfollowPet(data.pet.id);
    } else {
      await followService.followPet(data.pet.id);
    }
    setFollowing(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <img
            className="h-[26rem] w-full rounded-[2.5rem] object-cover shadow-[0_24px_60px_rgba(117,97,70,0.12)]"
            src={data.pet.image}
            alt={data.pet.name}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {data.pet.gallery.slice(0, 2).map((image) => (
              <img
                key={image}
                className="h-48 w-full rounded-[1.75rem] object-cover"
                src={image}
                alt={data.pet.name}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <TrustBadge level={data.pet.trustLevel} />
            <span className="rounded-full bg-brand-orange-soft px-3 py-1 text-sm font-semibold text-brand-orange-strong">
              {petStatusLabels[data.pet.status]}
            </span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-sage">
              {data.pet.city}, {data.pet.state}
            </p>
            <h1 className="mt-3 font-display text-5xl text-brand-ink">{data.pet.name}</h1>
            <p className="mt-4 text-lg leading-8 text-brand-muted">{data.pet.story}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.75rem] bg-white p-5">
              <p className="text-sm text-brand-muted">Responsavel atual</p>
              <h2 className="mt-2 font-display text-2xl text-brand-ink">{data.organization?.name}</h2>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                Instituicao responsavel por este pet e seus registros de cuidado.
              </p>
              {data.organization ? (
                <Link
                  className="mt-4 inline-flex rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-cream"
                  to={`/organizations/${data.organization.slug}`}
                >
                  Ver perfil da ONG
                </Link>
              ) : null}
            </article>
            <article className="rounded-[1.75rem] bg-white p-5">
              <p className="text-sm text-brand-muted">Saude e vacinas</p>
              <h2 className="mt-2 font-display text-2xl text-brand-ink">{data.pet.healthStatus}</h2>
              <p className="mt-2 text-sm text-brand-muted">
                {data.pet.vaccineRecords.length} registros de vacina acompanhados.
              </p>
            </article>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_16px_40px_rgba(117,97,70,0.08)]">
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.75rem] bg-brand-panel p-5">
                <p className="text-sm text-brand-muted">Rede de acompanhamento</p>
                <p className="mt-2 font-display text-4xl text-brand-ink">
                  {data.pet.followerCount} seguidores
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  Seguir serve para guardar a historia deste pet por perto e acompanhar novas atualizacoes.
                </p>
                <div className="mt-5">
                  {canFollowPets(currentUser) ? (
                    <button
                      className="w-full rounded-full border border-brand-line bg-white px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-cream disabled:opacity-60"
                      disabled={following}
                      onClick={() => {
                        void handleFollowToggle();
                      }}
                      type="button"
                    >
                      {following
                        ? 'Atualizando...'
                        : isFollowing
                          ? 'Deixar de seguir'
                          : 'Seguir jornada'}
                    </button>
                  ) : (
                    <Link
                      className="block w-full rounded-full border border-brand-line bg-white px-5 py-3 text-center text-sm font-semibold text-brand-ink transition hover:bg-brand-cream"
                      to="/login"
                    >
                      Entrar para seguir
                    </Link>
                  )}
                </div>
              </article>

              <article className="rounded-[1.75rem] bg-[linear-gradient(180deg,#fff1e5_0%,#ffffff_100%)] p-5">
                <p className="text-sm text-brand-muted">Apoio direto</p>
                <p className="mt-2 font-display text-4xl text-brand-ink">
                  {data.pet.sponsorCount} Pawdrinhos
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  Apadrinhar transforma afeto em cuidado ativo, ajudando nas necessidades reais do pet.
                </p>
                <div className="mt-5">
                  <Link
                    className="block w-full rounded-full bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-orange-strong"
                    to={`/apoios?targetType=pet&targetId=${data.pet.remoteId ?? data.pet.id}`}
                  >
                    Apoiar este pet
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-8">
          <div className="space-y-5">
            <h2 className="font-display text-4xl text-brand-ink">Necessidades do pet</h2>
            <div className="grid gap-5">
              {data.needs.map((need) => (
                <NeedCard key={need.id} need={need} />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="font-display text-4xl text-brand-ink">Timeline da jornada</h2>
            <div className="grid gap-4">
              {data.timeline.map((post) => (
                <TimelineCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-5">
            <h2 className="font-display text-4xl text-brand-ink">Cartinhas</h2>
            <div className="grid gap-4">
              {data.letters.map((letter) => (
                <LetterCard key={letter.id} letter={letter} />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6">
            <h2 className="font-display text-3xl text-brand-ink">Transparencia</h2>
            <div className="mt-5 space-y-4">
              {data.transparency.map((record) => (
                <article key={record.id} className="rounded-[1.5rem] bg-brand-panel p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-brand-ink">{record.title}</h3>
                    <span className="text-sm font-semibold text-brand-sage-strong">
                      {formatCurrency(record.amountUsed)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">{record.description}</p>
                  <p className="mt-3 text-sm text-brand-muted">{formatDate(record.date)}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-brand-sky-soft p-6">
            <h2 className="font-display text-3xl text-brand-ink">Vacinas</h2>
            <div className="mt-5 space-y-3">
              {data.pet.vaccineRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-[1.25rem] bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-brand-ink">{record.name}</p>
                    <p className="text-sm text-brand-muted">{formatDate(record.date)}</p>
                  </div>
                  <span className="rounded-full bg-brand-sage-soft px-3 py-1 text-xs font-semibold text-brand-sage-strong">
                    {record.status === 'done' ? 'Realizada' : 'Agendada'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            to={`/reports?petId=${data.pet.id}`}
          >
            Denunciar irregularidade
          </Link>
        </div>
      </section>
    </div>
  );
}
