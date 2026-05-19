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
type ApiTransparencyRecord = Parameters<typeof mapRemoteTransparencyRecord>[0];

type ApiPetListResponse = {
  data?: ApiPet[];
};

export interface PetProfileData {
  pet: Pet;
  organization: {
    id: string;
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

const filterLocalPets = (filters: PetFilters = {}) => {
  const { pets } = usePetStore.getState();

  return pets.filter((pet) => {
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
};

const mergeRemotePetsIntoStore = (remotePets: Pet[]) => {
  usePetStore.getState().mergeRemotePets(remotePets);
};

const filterRemotePets = (pets: Pet[], filters: PetFilters = {}) =>
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
            filters.status && filters.status !== 'all'
              ? filters.status.toUpperCase()
              : undefined,
          urgency_level:
            filters.urgency && filters.urgency !== 'all'
              ? filters.urgency.toUpperCase()
              : undefined,
        },
      });

      const remotePets = (response.data?.result?.data ?? []).map((entry) => mapRemotePetToPet(entry));

      mergeRemotePetsIntoStore(remotePets);

      return filterRemotePets(remotePets, filters);
    } catch {
      return filterLocalPets(filters);
    }
  },

  async show(slug: string) {
    const localPet = usePetStore.getState().pets.find((entry) => entry.slug === slug);
    try {
      const response = await publicHttp.get<ApiEnvelope<ApiPet>>(`/pets/${slug}`);
      const remotePet = response.data?.result;

      if (!remotePet) {
        return localPet ?? null;
      }

      const pet = mapRemotePetToPet(remotePet);
      mergeRemotePetsIntoStore([pet]);
      return pet;
    } catch {
      return localPet ?? null;
    }
  },

  async profile(slug: string): Promise<PetProfileData | null> {
    const localPet = usePetStore.getState().pets.find((entry) => entry.slug === slug);

    try {
      const [petResponse, transparencyResponse] = await Promise.all([
        publicHttp.get<ApiEnvelope<ApiPet>>(`/pets/${slug}`),
        publicHttp.get<ApiEnvelope<{ data?: ApiTransparencyRecord[] }>>(`/pets/${slug}/transparency`),
      ]);

      const remotePet = petResponse.data?.result;

      if (!remotePet) {
        return localPet
          ? {
              pet: localPet,
              organization:
                usePetStore.getState().organizations.find((entry) => entry.id === localPet.organizationId) ??
                null,
              needs: usePetStore.getState().needs.filter((need) => need.petId === localPet.id),
              timeline: usePetStore.getState().timelinePosts.filter((post) => post.petId === localPet.id),
              letters: usePetStore.getState().petLetters.filter((letter) => letter.petId === localPet.id),
              transparency: usePetStore
                .getState()
                .transparencyRecords.filter((record) => record.petId === localPet.id),
            }
          : null;
      }

      const mappedPet = mapRemotePetToPet(remotePet);
      const mappedNeeds = (remotePet.needs ?? []).map((need) => ({
        ...mapRemoteNeed(need),
        petId: mappedPet.id,
      }));
      const mappedTimeline = (remotePet.timeline ?? []).map((post) => ({
        ...mapRemoteTimelinePost(post),
        petId: mappedPet.id,
      }));
      const mappedLetters = (remotePet.letters ?? []).map((letter) => ({
        ...mapRemotePetLetter(letter),
        petId: mappedPet.id,
      }));
      const mappedTransparency = (transparencyResponse.data?.result?.data ?? []).map((record) =>
        mapRemoteTransparencyRecord(record, new Map()),
      ).map((record) => ({
        ...record,
        petId: mappedPet.id,
      }));

      usePetStore.getState().mergeRemotePets([mappedPet]);
      usePetStore.getState().mergeRemoteNeeds(mappedNeeds);
      usePetStore.getState().mergeRemoteTimelinePosts(mappedTimeline);
      usePetStore.getState().mergeRemoteTransparencyRecords(mappedTransparency);

      const organization =
        remotePet.organization
          ? {
              id: String(remotePet.organization.id),
              name: remotePet.organization.name,
              description: remotePet.organization.description ?? '',
              city: remotePet.organization.city,
              state: remotePet.organization.state,
            }
          : usePetStore.getState().organizations.find((entry) => entry.id === mappedPet.organizationId) ?? null;

      return {
        pet: mappedPet,
        organization,
        needs: mappedNeeds,
        timeline: mappedTimeline,
        letters: mappedLetters,
        transparency: mappedTransparency,
      };
    } catch {
      if (!localPet) {
        return null;
      }

      return {
        pet: localPet,
        organization:
          usePetStore.getState().organizations.find((entry) => entry.id === localPet.organizationId) ??
          null,
        needs: usePetStore.getState().needs.filter((need) => need.petId === localPet.id),
        timeline: usePetStore.getState().timelinePosts.filter((post) => post.petId === localPet.id),
        letters: usePetStore.getState().petLetters.filter((letter) => letter.petId === localPet.id),
        transparency: usePetStore
          .getState()
          .transparencyRecords.filter((record) => record.petId === localPet.id),
      };
    }
  },
};
