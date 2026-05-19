import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { mapApiUserToLocalUser } from './api-mappers';
import { http } from './http';
import { delay } from './delay';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiUser = Parameters<typeof mapApiUserToLocalUser>[0];

const resolvePet = (petId: string) =>
  usePetStore
    .getState()
    .pets.find((entry) => entry.id === petId || entry.remoteId === petId) ?? null;

export const followService = {
  async followPet(petId: string) {
    await delay(200);
    const currentUser = useAuthStore.getState().currentUser;
    const pet = resolvePet(petId);

    if (!currentUser || currentUser.followedPetIds.includes(petId)) {
      return false;
    }

    if (pet) {
      try {
        const response = await http.post<ApiEnvelope<ApiUser>>(`/pets/${pet.slug}/follow`);
        const apiUser = response.data?.result;

        if (apiUser) {
          const hydratedUser = mapApiUserToLocalUser(apiUser, currentUser);
          useAuthStore.getState().setCurrentUser(hydratedUser);
        } else {
          useAuthStore.getState().followPet(petId);
        }

        usePetStore.getState().followPet(petId);
        return true;
      } catch {
        // Fall back to local state below.
      }
    }

    useAuthStore.getState().followPet(petId);
    usePetStore.getState().followPet(petId);
    return true;
  },
  async unfollowPet(petId: string) {
    await delay(200);
    const currentUser = useAuthStore.getState().currentUser;
    const pet = resolvePet(petId);

    if (!currentUser || !currentUser.followedPetIds.includes(petId)) {
      return false;
    }

    if (pet) {
      try {
        const response = await http.delete<ApiEnvelope<ApiUser>>(`/pets/${pet.slug}/follow`);
        const apiUser = response.data?.result;

        if (apiUser) {
          const hydratedUser = mapApiUserToLocalUser(apiUser, currentUser);
          useAuthStore.getState().setCurrentUser(hydratedUser);
        } else {
          useAuthStore.getState().unfollowPet(petId);
        }

        usePetStore.getState().unfollowPet(petId);
        return true;
      } catch {
        // Fall back to local state below.
      }
    }

    useAuthStore.getState().unfollowPet(petId);
    usePetStore.getState().unfollowPet(petId);
    return true;
  },
};
