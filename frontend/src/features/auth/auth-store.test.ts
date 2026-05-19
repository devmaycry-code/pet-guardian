import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './auth-store';
import { usePetStore } from '../pets/pet-store';

const resetState = () => {
  localStorage.clear();
  useAuthStore.getState().logout();
  usePetStore.getState().resetData();
};

describe('useAuthStore', () => {
  beforeEach(resetState);

  it('loads a profile and keeps the follow list consistent', () => {
    useAuthStore.getState().loginAs('user-marina');

    const currentUser = useAuthStore.getState().currentUser;
    expect(currentUser?.name).toBe('Marina Rocha');

    useAuthStore.getState().followPet('pet-mel');
    useAuthStore.getState().followPet('pet-mel');
    expect(useAuthStore.getState().currentUser?.followedPetIds).toContain('pet-mel');
    expect(
      useAuthStore.getState().currentUser?.followedPetIds.filter((petId) => petId === 'pet-mel'),
    ).toHaveLength(1);

    useAuthStore.getState().unfollowPet('pet-luna');
    expect(useAuthStore.getState().currentUser?.followedPetIds).not.toContain('pet-luna');
  });

  it('clears the current user on logout and ignores unknown profiles', () => {
    useAuthStore.getState().loginAs('missing-user');
    expect(useAuthStore.getState().currentUser).toBeNull();

    useAuthStore.getState().loginAs('user-marina');
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().currentUser).toBeNull();
  });
});
