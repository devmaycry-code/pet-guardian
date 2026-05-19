import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { mapApiUserToLocalUser } from './api-mappers';
import { http } from './http';

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
    const currentUser = useAuthStore.getState().currentUser;
    const pet = resolvePet(petId);

    if (!currentUser || !pet || currentUser.followedPetIds.includes(petId)) {
      return false;
    }

    const response = await http.post<ApiEnvelope<ApiUser>>(`/pets/${pet.slug}/follow`);
    const apiUser = response.data?.result;

    if (apiUser) {
      const hydratedUser = mapApiUserToLocalUser(apiUser, currentUser);
      useAuthStore.getState().setCurrentUser(hydratedUser);
    }

    usePetStore.getState().followPet(petId);
    useAuthStore.getState().followPet(petId);
    return true;
  },

  async unfollowPet(petId: string) {
    const currentUser = useAuthStore.getState().currentUser;
    const pet = resolvePet(petId);

    if (!currentUser || !pet || !currentUser.followedPetIds.includes(petId)) {
      return false;
    }

    const response = await http.delete<ApiEnvelope<ApiUser>>(`/pets/${pet.slug}/follow`);
    const apiUser = response.data?.result;

    if (apiUser) {
      const hydratedUser = mapApiUserToLocalUser(apiUser, currentUser);
      useAuthStore.getState().setCurrentUser(hydratedUser);
    }

    usePetStore.getState().unfollowPet(petId);
    useAuthStore.getState().unfollowPet(petId);
    return true;
  },
};
