import { usePetStore } from '../features/pets/pet-store';
import type {
  Need,
  NeedPriority,
  Pet,
  PetLetter,
  PetStatus,
  TimelinePost,
  TransparencyRecord,
} from '../types/domain';
import { publicHttp } from './http';
import {
  mapRemoteNeed,
  mapRemotePetLetter,
  mapRemotePetToPet,
  mapRemoteTimelinePost,
  mapRemoteTransparencyRecord,
} from './api-mappers';

export interface PetFilters {
  query?: string;
  species?: 'all' | 'dog' | 'cat';
  status?: 'all' | PetStatus;
  urgency?: 'all' | NeedPriority;
}

type ApiEnvelope<T> = {
  result?: T;
};

type ApiPet = Parameters<typeof mapRemotePetToPet>[0];
type ApiNeed = Parameters<typeof mapRemoteNeed>[0];
type ApiTimelinePost = Parameters<typeof mapRemoteTimelinePost>[0];
type ApiPetLetter = Parameters<typeof mapRemotePetLetter>[0];
type ApiTransparencyRecord = Parameters<typeof mapRemoteTransparencyRecord>[0];

type ApiPetListResponse = {
  data?: ApiPet[];
};

export interface PetProfileData {
  pet: Pet;
  organization: {
    id: string;
    slug: string;
    name: string;
    description: string;
    city: string;
    state: string;
  } | null;
  needs: Need[];
  timeline: TimelinePost[];
  letters: PetLetter[];
  transparency: TransparencyRecord[];
}

const filterPets = (pets: Pet[], filters: PetFilters = {}) =>
  pets.filter((pet) => {
    const matchesQuery =
      !filters.query ||
      `${pet.name} ${pet.breed} ${pet.city}`.toLowerCase().includes(filters.query.toLowerCase());
    const matchesSpecies =
      !filters.species || filters.species === 'all' || pet.species === filters.species;
    const matchesStatus =
      !filters.status || filters.status === 'all' || pet.status === filters.status;
    const matchesUrgency =
      !filters.urgency || filters.urgency === 'all' || pet.urgencyLevel === filters.urgency;

    return matchesQuery && matchesSpecies && matchesStatus && matchesUrgency;
  });

export const petsService = {
  async list(filters: PetFilters = {}) {
    try {
      const response = await publicHttp.get<ApiEnvelope<ApiPetListResponse>>('/pets', {
        params: {
          search: filters.query || undefined,
          status:
            filters.status && filters.status !== 'all' ? filters.status.toUpperCase() : undefined,
          urgency_level:
            filters.urgency && filters.urgency !== 'all'
              ? filters.urgency.toUpperCase()
              : undefined,
        },
      });

      const remotePets = (response.data?.result?.data ?? []).map((entry) => mapRemotePetToPet(entry));
      if (remotePets.length > 0) {
        usePetStore.getState().mergeRemotePets(remotePets);
        return filterPets(remotePets, filters);
      }
    } catch {
      // Fallback local abaixo.
    }

    return filterPets(usePetStore.getState().pets, filters);
  },

  async show(slug: string) {
    try {
      const response = await publicHttp.get<ApiEnvelope<ApiPet>>(`/pets/${slug}`);
      const remotePet = response.data?.result;

      if (remotePet) {
        const pet = mapRemotePetToPet(remotePet);
        usePetStore.getState().mergeRemotePets([pet]);
        return pet;
      }
    } catch {
      // Fallback local abaixo.
    }

    return usePetStore.getState().pets.find((pet) => pet.slug === slug) ?? null;
  },

  async profile(slug: string): Promise<PetProfileData | null> {
    try {
      const [petResponse, needsResponse, timelineResponse, transparencyResponse] =
        await Promise.all([
          publicHttp.get<ApiEnvelope<ApiPet>>(`/pets/${slug}`),
          publicHttp.get<ApiEnvelope<ApiNeed[]>>(`/pets/${slug}/needs`),
          publicHttp.get<ApiEnvelope<ApiTimelinePost[]>>(`/pets/${slug}/timeline`),
          publicHttp.get<ApiEnvelope<ApiTransparencyRecord[]>>(`/pets/${slug}/transparency`),
        ]);

      const remotePet = petResponse.data?.result;

      if (remotePet) {
        const mappedPet = mapRemotePetToPet(remotePet);
        const mappedNeeds = (needsResponse.data?.result ?? []).map((need) => ({
          ...mapRemoteNeed(need),
          petId: mappedPet.id,
        }));
        const mappedTimeline = (timelineResponse.data?.result ?? []).map((post) => ({
          ...mapRemoteTimelinePost(post),
          petId: mappedPet.id,
        }));
        const mappedLetters = (remotePet.letters ?? []).map((letter) => ({
          ...mapRemotePetLetter(letter as ApiPetLetter),
          petId: mappedPet.id,
        }));
        const mappedTransparency = (transparencyResponse.data?.result ?? []).map((record) => ({
          ...mapRemoteTransparencyRecord(record, new Map()),
          petId: mappedPet.id,
        }));

        usePetStore.getState().mergeRemotePets([mappedPet]);
        usePetStore.getState().mergeRemoteNeeds(mappedNeeds);
        usePetStore.getState().mergeRemoteTimelinePosts(mappedTimeline);
        usePetStore.getState().mergeRemoteTransparencyRecords(mappedTransparency);

        const organization = remotePet.organization
          ? {
              id: String(remotePet.organization.id),
              slug: remotePet.organization.slug,
              name: remotePet.organization.name,
              description: remotePet.organization.description ?? '',
              city: remotePet.organization.city,
              state: remotePet.organization.state,
            }
          : null;

        return {
          pet: mappedPet,
          organization,
          needs: mappedNeeds,
          timeline: mappedTimeline,
          letters: mappedLetters,
          transparency: mappedTransparency,
        };
      }
    } catch {
      // Fallback local abaixo.
    }

    const localPet = usePetStore.getState().pets.find((entry) => entry.slug === slug);

    if (!localPet) {
      return null;
    }

    const localOrganization = usePetStore
      .getState()
      .organizations.find((entry) => entry.id === localPet.organizationId);
    const localNeeds = usePetStore.getState().needs.filter((need) => need.petId === localPet.id);
    const localTimeline = usePetStore
      .getState()
      .timelinePosts.filter((entry) => entry.petId === localPet.id);
    const localLetters = usePetStore.getState().petLetters.filter((entry) => entry.petId === localPet.id);
    const localTransparency = usePetStore
      .getState()
      .transparencyRecords.filter((entry) => entry.petId === localPet.id);

    return {
      pet: localPet,
      organization: localOrganization
        ? {
            id: localOrganization.id,
            slug: localOrganization.slug,
            name: localOrganization.name,
            description: localOrganization.description,
            city: localOrganization.city,
            state: localOrganization.state,
          }
        : null,
      needs: localNeeds,
      timeline: localTimeline,
      letters: localLetters,
      transparency: localTransparency,
    };
  },
};
