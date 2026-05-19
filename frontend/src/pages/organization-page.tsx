import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/empty-state';
import { PetCard } from '../components/pet-card';
import { SectionHeading } from '../components/section-heading';
import { TrustBadge } from '../components/trust-badge';
import { useEffect, useState } from 'react';
import { organizationsService, type OrganizationProfileData } from '../services/organizations-service';

export function OrganizationPage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<OrganizationProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      return;
    }

    void Promise.resolve().then(() => setLoading(true));
    let cancelled = false;

    void organizationsService.show(slug).then((data) => {
      if (!cancelled) {
        setProfile(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
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
          title="Carregando perfil da ONG"
          description="Estamos buscando os dados institucionais e os pets ligados a esta organizacao."
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="ONG nao encontrada"
          description="A organizacao solicitada nao esta mais disponivel ou ainda nao foi publicada."
        />
      </div>
    );
  }

  const { organization, pets } = profile;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 rounded-[2.5rem] bg-white p-8 shadow-[0_18px_48px_rgba(117,97,70,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-sage">
            Perfil institucional
          </p>
          <h1 className="font-display text-5xl text-brand-ink">{organization.name}</h1>
          <TrustBadge level={organization.trustLevel} />
          <p className="text-lg leading-8 text-brand-muted">{organization.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.5rem] bg-brand-panel p-5">
              <p className="text-sm text-brand-muted">Localizacao</p>
              <p className="mt-2 font-semibold text-brand-ink">
                {organization.city}, {organization.state}
              </p>
            </article>
            <article className="rounded-[1.5rem] bg-brand-panel p-5">
              <p className="text-sm text-brand-muted">Pets sob cuidado</p>
              <p className="mt-2 font-semibold text-brand-ink">{pets.length}</p>
            </article>
          </div>
          <Link
            className="inline-flex rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-strong"
            to={`/apoios?targetType=organization&targetId=${organization.id}`}
          >
            Apoiar esta ONG
          </Link>
        </div>

        <div className="rounded-[2.5rem] bg-white p-6">
          <SectionHeading
            eyebrow="Pets da ONG"
            title="A vitrine institucional mostra os pets que esta ONG cuida."
            description="Cada card abre o perfil do pet, enquanto a ONG concentra a visao institucional e a relacao de cuidado."
          />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
