import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { mapRemoteNeed, mapRemotePetToPet, mapRemoteTimelinePost } from './api-mappers';
import { slugify } from '../utils/format';
import { http } from './http';

interface DashboardPetPayload {
  name: string;
  species: 'dog' | 'cat';
  city: string;
  state: string;
  summary: string;
  story: string;
  organizationId: string;
  avatarFile?: File | null;
}

interface DashboardNeedPayload {
  petId: string;
  title: string;
  description: string;
  estimatedAmount: number;
}

interface DashboardTimelinePayload {
  petId: string;
  title: string;
  content: string;
}

type ApiEnvelope<T> = {
  result?: T;
};

const resolvePetSlug = (petId: string) =>
  usePetStore.getState().pets.find((pet) => pet.id === petId || pet.remoteId === petId)?.slug ??
  slugify(petId);

const resolvePet = (petId: string) =>
  usePetStore
    .getState()
    .pets.find((pet) => pet.id === petId || pet.remoteId === petId) ?? null;

const buildPetDraft = (payload: DashboardPetPayload) => ({
  slug: slugify(payload.name),
  sex: 'female' as const,
  estimatedAge: 'idade nao informada',
  size: 'medium' as const,
  image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
});

const buildPetRequestBody = (payload: DashboardPetPayload, draft: ReturnType<typeof buildPetDraft>) => {
  if (!payload.avatarFile) {
    return {
      organization_id: Number.isFinite(Number(payload.organizationId))
        ? Number(payload.organizationId)
        : undefined,
      name: payload.name,
      slug: draft.slug,
      species: payload.species,
      gender: draft.sex,
      age: draft.estimatedAge,
      size: draft.size,
      story: payload.story,
      rescue_story: payload.summary,
      avatar: draft.image,
      city: payload.city,
      state: payload.state,
    };
  }

  const formData = new FormData();

  formData.append('organization_id', payload.organizationId);
  formData.append('name', payload.name);
  formData.append('slug', draft.slug);
  formData.append('species', payload.species);
  formData.append('gender', draft.sex);
  formData.append('age', draft.estimatedAge);
  formData.append('size', draft.size);
  formData.append('story', payload.story);
  formData.append('rescue_story', payload.summary);
  formData.append('city', payload.city);
  formData.append('state', payload.state);
  formData.append('avatar_file', payload.avatarFile);

  return formData;
};

export const dashboardService = {
  async createPet(payload: DashboardPetPayload) {
    const token = useAuthStore.getState().accessToken;
    const draft = buildPetDraft(payload);

    if (token) {
      try {
        const response = await http.post<ApiEnvelope<Parameters<typeof mapRemotePetToPet>[0]>>(
          '/pets',
          buildPetRequestBody(payload, draft),
        );

        const remotePet = response.data?.result;
        if (remotePet) {
          const mappedPet = mapRemotePetToPet(remotePet);
          usePetStore.getState().mergeRemotePets([mappedPet]);
          return mappedPet;
        }
      } catch {
        // Keep local creation when the backend rejects the request.
      }
    }

    return usePetStore.getState().createPet(payload);
  },

  async addNeed(payload: DashboardNeedPayload) {
    const pet = resolvePet(payload.petId);
    const token = useAuthStore.getState().accessToken;

    if (token && pet) {
      try {
        const response = await http.post<ApiEnvelope<Parameters<typeof mapRemoteNeed>[0]>>(
          `/pets/${resolvePetSlug(pet.id)}/needs`,
          {
            title: payload.title,
            description: payload.description,
            type: 'care',
            goal_amount: payload.estimatedAmount,
            current_amount: 0,
            urgency_level: 'high',
            status: 'open',
            proof_required: true,
          },
        );

        const remoteNeed = response.data?.result;
        if (remoteNeed) {
          const mappedNeed = {
            ...mapRemoteNeed(remoteNeed),
            petId: payload.petId,
          };

          usePetStore.getState().mergeRemoteNeeds([mappedNeed]);
          return mappedNeed;
        }
      } catch {
        // Local fallback already applied above.
      }
    }

    return usePetStore.getState().addNeed(payload);
  },

  async addTimelinePost(payload: DashboardTimelinePayload) {
    const pet = resolvePet(payload.petId);
    const token = useAuthStore.getState().accessToken;

    if (token && pet) {
      try {
        const response = await http.post<ApiEnvelope<Parameters<typeof mapRemoteTimelinePost>[0]>>(
          `/pets/${resolvePetSlug(pet.id)}/timeline`,
          {
            title: payload.title,
            content: payload.content,
            type: 'milestone',
          },
        );

        const remoteTimelinePost = response.data?.result;
        if (remoteTimelinePost) {
          const mappedTimelinePost = {
            ...mapRemoteTimelinePost(remoteTimelinePost),
            petId: payload.petId,
          };

          usePetStore.getState().mergeRemoteTimelinePosts([mappedTimelinePost]);
          return mappedTimelinePost;
        }
      } catch {
        // Local fallback already applied above.
      }
    }

    return usePetStore.getState().addTimelinePost(payload);
  },

  reset() {
    usePetStore.getState().resetData();
  },
};
