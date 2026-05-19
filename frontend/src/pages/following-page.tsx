import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/empty-state';
import { PetCard } from '../components/pet-card';
import { SectionHeading } from '../components/section-heading';
import { TimelineCard } from '../components/timeline-card';
import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { petsService } from '../services/pets-service';
import type { TimelinePost } from '../types/domain';

export function FollowingPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { pets, timelinePosts } = usePetStore();
  const [remoteFeed, setRemoteFeed] = useState<TimelinePost[] | null>(null);
  const followedPetSlugs = useMemo(
    () =>
      currentUser
        ? pets
            .filter((pet) => currentUser.followedPetIds.includes(pet.id))
            .map((pet) => pet.slug)
        : [],
    [currentUser, pets],
  );

  const followedPets = currentUser
    ? pets.filter((pet) => currentUser.followedPetIds.includes(pet.id))
    : [];
  const followedIds = new Set(followedPets.map((pet) => pet.id));
  const localFeed = timelinePosts
    .filter((post) => followedIds.has(post.petId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  useEffect(() => {
    if (!currentUser || followedPetSlugs.length === 0) {
      return;
    }

    let cancelled = false;

    void Promise.all(
      followedPetSlugs.map(async (slug) => {
        const profile = await petsService.profile(slug);
        return profile?.timeline ?? [];
      }),
    ).then((entries) => {
      if (cancelled) {
        return;
      }

      const mergedFeed = entries
        .flat()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      setRemoteFeed(mergedFeed.length ? mergedFeed : null);
    });

    return () => {
      cancelled = true;
    };
  }, [currentUser, followedPetSlugs]);

  const feed = currentUser ? remoteFeed ?? localFeed : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="space-y-5">
        <SectionHeading
          eyebrow="Seguindo"
          title="Acompanhe pets que voce quis guardar por perto."
          description="Seguir nao substitui ajuda. E um jeito leve de manter o pet no radar, receber contexto e decidir depois como apoiar."
        />
      </section>

      {!currentUser ? (
        <div className="mt-10">
          <EmptyState
            title="Entre para seguir pets"
            description="Com acesso demo, voce pode montar sua propria lista de pets acompanhados e ver as atualizacoes em um feed pessoal."
          />
        </div>
      ) : followedPets.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Voce ainda nao segue nenhum pet"
            description="Abra um perfil de pet, clique em seguir e volte aqui para acompanhar a jornada como em uma rede social de cuidado."
          />
        </div>
      ) : (
        <>
          <section className="mt-10">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {followedPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </section>

          <section className="mt-16 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-4xl text-brand-ink">Feed dos pets seguidos</h2>
              <Link className="text-sm font-semibold text-brand-sage-strong" to="/pets">
                Descobrir mais pets
              </Link>
            </div>
            <div className="grid gap-4">
              {feed.map((post) => (
                <TimelineCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
