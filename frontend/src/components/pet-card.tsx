import { Link } from 'react-router-dom';
import type { Pet } from '../types/domain';
import { needPriorityLabels, petStatusLabels } from '../utils/labels';
import { TrustBadge } from './trust-badge';

export function PetCard({ pet }: { pet: Pet }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_45px_rgba(117,97,70,0.08)]">
      <img className="h-56 w-full object-cover" src={pet.image} alt={pet.name} />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-brand-muted">
              {pet.city}, {pet.state}
            </p>
            <h3 className="font-display text-2xl text-brand-ink">{pet.name}</h3>
          </div>
          <TrustBadge level={pet.trustLevel} />
        </div>
        <p className="text-sm leading-6 text-brand-muted">{pet.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-brand-cream-deep px-3 py-1 text-brand-ink">
            {petStatusLabels[pet.status]}
          </span>
          <span className="rounded-full bg-brand-orange-soft px-3 py-1 text-brand-orange-strong">
            Urgencia {needPriorityLabels[pet.urgencyLevel].toLowerCase()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-muted">
            {pet.followerCount} seguidores · {pet.sponsorCount} Pawdrinhos
          </span>
          <Link
            className="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-sage"
            to={`/pets/${pet.slug}`}
          >
            Conhecer historia
          </Link>
        </div>
      </div>
    </article>
  );
}
