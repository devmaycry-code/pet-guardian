import { useEffect, useState } from 'react';
import { EmptyState } from '../components/empty-state';
import { PetCard } from '../components/pet-card';
import { SearchFilterBar } from '../components/search-filter-bar';
import { SectionHeading } from '../components/section-heading';
import { petsService } from '../services/pets-service';
import type { NeedPriority, Pet, PetStatus } from '../types/domain';

export function PetsPage() {
  const [query, setQuery] = useState('');
  const [species, setSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [status, setStatus] = useState<'all' | PetStatus>('all');
  const [urgency, setUrgency] = useState<'all' | NeedPriority>('all');
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    void petsService.list({ query, species, status, urgency }).then(setPets);
  }, [query, species, status, urgency]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Catalogo de pets"
          title="Encontre um pet para acompanhar com calma, contexto e confianca."
          description="A busca prioriza clareza: status real, urgencia, verificacao e historico do responsavel."
        />
        <SearchFilterBar
          query={query}
          species={species}
          status={status}
          urgency={urgency}
          onQueryChange={setQuery}
          onSpeciesChange={setSpecies}
          onStatusChange={setStatus}
          onUrgencyChange={setUrgency}
        />
      </section>

      <section className="mt-10">
        {pets.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum pet encontrado"
            description="Tente ajustar a busca ou limpar os filtros para descobrir outros perfis."
          />
        )}
      </section>
    </div>
  );
}
