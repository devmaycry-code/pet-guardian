import { AccessSummaryCard } from '../components/access-summary-card';
import { Link } from 'react-router-dom';
import { LetterCard } from '../components/letter-card';
import { NeedCard } from '../components/need-card';
import { PetCard } from '../components/pet-card';
import { SectionHeading } from '../components/section-heading';
import { TrustBadge } from '../components/trust-badge';
import { usePetStore } from '../features/pets/pet-store';

export function HomePage() {
  const organizations = usePetStore((state) => state.organizations);
  const pets = usePetStore((state) => state.pets);
  const needs = usePetStore((state) => state.needs);
  const petLetters = usePetStore((state) => state.petLetters);

  const highlightedPets = pets.filter((pet) => pet.highlight).slice(0, 4);
  const urgentNeeds = [...needs]
    .sort((a, b) => b.estimatedAmount - a.estimatedAmount)
    .slice(0, 3);
  const verifiedOrganizations = organizations
    .filter((org) => org.kind === 'ngo')
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-sage">
            Cuidado continuo, nao ajuda pontual
          </p>
          <h1 className="max-w-3xl font-display text-5xl leading-tight text-brand-ink md:text-7xl">
            Seja Pawdrinho de um pet e acompanhe cada passo da recuperacao.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-brand-muted">
            O PetGuardian transforma doacao isolada em jornada acompanhada. Aqui voce entende a historia, ve as necessidades reais e acompanha como cada ajuda chega ao pet.
          </p>
          <p className="max-w-2xl text-base leading-7 text-brand-muted">
            Nem todo acompanhamento precisa comecar com doacao. Voce tambem pode seguir um pet, guardar a historia por perto e decidir depois como ajudar.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="rounded-full bg-brand-orange px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-brand-orange-strong"
              to="/pets"
            >
              Vire um Pawdrinho
            </Link>
            <Link
              className="rounded-full border border-brand-line bg-white px-6 py-4 text-center text-sm font-semibold text-brand-ink transition hover:bg-brand-panel"
              to="/transparency"
            >
              Entender nossa transparencia
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#f7e2cf_0%,#ffffff_44%,#dbedf8_100%)] p-8 shadow-[0_24px_60px_rgba(117,97,70,0.12)]">
          <div className="space-y-5">
            <div className="rounded-[1.75rem] bg-white/90 p-5">
              <p className="text-sm text-brand-muted">Necessidade urgente em andamento</p>
              <h2 className="mt-2 font-display text-3xl text-brand-ink">Luna precisa concluir o tratamento de pele.</h2>
              <p className="mt-3 text-sm leading-6 text-brand-muted">
                Cada atualizacao publica mostra consultas, compras de remedios e evolucao clinica.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-brand-sage-soft p-5">
                <p className="text-sm text-brand-sage-strong">Pawdrinhos ativos</p>
                <p className="mt-3 font-display text-4xl text-brand-ink">74</p>
              </div>
              <div className="rounded-[1.75rem] bg-brand-sky-soft p-5">
                <p className="text-sm text-brand-sky-strong">ONGs verificadas</p>
                <p className="mt-3 font-display text-4xl text-brand-ink">3</p>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5">
              <p className="text-sm font-semibold text-brand-ink">Antifraude desde o primeiro clique</p>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                Perfis exibem nivel de verificacao, score de transparencia, historico publico e canal de denuncia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 space-y-8">
        <SectionHeading
          eyebrow="Pets em destaque"
          title="Historias que precisam de continuidade, nao so de visibilidade."
          description="Selecao de pets com necessidades ativas, atualizacoes recentes e sinalizacao clara de confianca."
          action={
            <Link className="text-sm font-semibold text-brand-sage-strong" to="/pets">
              Ver todos os pets
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {highlightedPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      <section className="mt-20 space-y-8">
        <SectionHeading
          eyebrow="Necessidades urgentes"
          title="Ajuda direcionada, com meta e acompanhamento."
          description="Cada necessidade mostra prioridade, arrecadacao e prazo para que o apoio seja claro e verificavel."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {urgentNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 rounded-[2.5rem] bg-white p-8 shadow-[0_18px_48px_rgba(117,97,70,0.08)]">
          <SectionHeading
            eyebrow="ONGs verificadas"
            title="Quem cuida tambem precisa ser visivel."
            description="O MVP destaca organizacoes com verificacao, historico e score de transparencia para reduzir incerteza."
          />
          <div className="space-y-4">
            {verifiedOrganizations.map((organization) => (
              <article
                key={organization.id}
                className="rounded-[1.5rem] border border-brand-line bg-brand-panel p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-brand-ink">{organization.name}</h3>
                  <TrustBadge level={organization.trustLevel} />
                </div>
                <p className="mt-3 text-sm leading-6 text-brand-muted">{organization.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-brand-muted">
                  <span>
                    {organization.city}, {organization.state}
                  </span>
                  <span>Score {organization.transparencyScore}/100</span>
                </div>
                <Link
                  className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-orange-soft"
                  to={`/organizations/${organization.id}`}
                >
                  Ver perfil institucional
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading
            eyebrow="Cartinhas"
            title="Atualizacoes emocionais ligadas a eventos reais."
            description="As cartinhas reforcam o vinculo com o pet, mas sempre nascem de fatos publicados na jornada dele."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {petLetters.slice(0, 4).map((letter) => (
              <LetterCard key={letter.id} letter={letter} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 space-y-8">
        <SectionHeading
          eyebrow="Responsabilidades"
          title="Cada perfil enxerga o que precisa, sem misturar cuidado com operacao."
          description="A area publica fica aberta para descoberta e transparencia. O que muda apos o login e a capacidade de agir: apadrinhar ou gerir casos."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <AccessSummaryCard title="Visitante" role="visitor" />
          <AccessSummaryCard title="Pawdrinho" role="pawdrinho" />
          <AccessSummaryCard title="Gestao" role="temporary_home_manager" />
        </div>
      </section>
    </div>
  );
}
