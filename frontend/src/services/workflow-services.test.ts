import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { initialAppData } from '../mocks/data';
import { authService } from './auth-service';
import { dashboardService } from './dashboard-service';
import { followService } from './follow-service';
import { petsService } from './pets-service';
import { reportsService } from './reports-service';
import { sponsorshipService } from './sponsorship-service';

vi.mock('./delay', () => ({
  delay: vi.fn(() => Promise.resolve()),
}));

vi.mock('./http', () => ({
  http: {
    post: vi.fn(async () => ({ data: {} })),
    delete: vi.fn(async () => ({ data: {} })),
    get: vi.fn(async () => ({ data: {} })),
  },
  publicHttp: {
    post: vi.fn(async () => ({ data: {} })),
    delete: vi.fn(async () => ({ data: {} })),
    get: vi.fn(async () => ({ data: {} })),
  },
}));

const resetState = () => {
  localStorage.clear();
  useAuthStore.getState().logout();
  usePetStore.getState().resetData();
};

describe('workflow services', () => {
  beforeEach(resetState);

  it('authenticates profiles through the mock auth service', async () => {
    const profiles = authService.listProfiles();
    expect(profiles).toHaveLength(initialAppData.users.length);

    const user = authService.login('user-marina');
    expect(user?.email).toBe('marina@petguardian.dev');

    await authService.logout();
    expect(useAuthStore.getState().currentUser).toBeNull();
  });

  it('keeps the auth and pet stores aligned when following pets', async () => {
    useAuthStore.getState().loginAs('user-marina');

    const pet = usePetStore.getState().pets.find((entry) => entry.id === 'pet-mel');
    const initialFollowerCount = pet?.followerCount ?? 0;

    await expect(followService.followPet('pet-mel')).resolves.toBe(true);
    expect(useAuthStore.getState().currentUser?.followedPetIds).toContain('pet-mel');
    expect(
      usePetStore.getState().pets.find((entry) => entry.id === 'pet-mel')?.followerCount,
    ).toBe(initialFollowerCount + 1);

    await expect(followService.followPet('pet-mel')).resolves.toBe(false);

    await expect(followService.unfollowPet('pet-mel')).resolves.toBe(true);
    expect(useAuthStore.getState().currentUser?.followedPetIds).not.toContain('pet-mel');
    expect(
      usePetStore.getState().pets.find((entry) => entry.id === 'pet-mel')?.followerCount,
    ).toBe(initialFollowerCount);
  });

  it('creates dashboard records and restores the initial dataset on reset', async () => {
    const organizationId = usePetStore.getState().organizations[0]?.id;

    const createdPet = await dashboardService.createPet({
      name: 'Pingo',
      species: 'cat',
      city: 'Curitiba',
      state: 'PR',
      summary: 'Filhote em socializacao.',
      story: 'Pingo veio de um resgate e esta ganhando confianca.',
      organizationId,
    });

    const newNeed = await dashboardService.addNeed({
      petId: createdPet.id,
      title: 'Racao',
      description: 'Racao especifica para a fase atual.',
      estimatedAmount: 120,
    });

    const newTimelinePost = await dashboardService.addTimelinePost({
      petId: createdPet.id,
      title: 'Primeiro dia',
      content: 'Pingo comeu bem e interagiu com a equipe.',
    });

    await sponsorshipService.sponsorPet(createdPet.id, 'Marina Rocha');
    await reportsService.create({
      petId: createdPet.id,
      reporterName: 'Marina Rocha',
      reason: 'missing_accountability',
      description: 'Registro de teste para validar o fluxo de denuncia.',
    });

    expect(usePetStore.getState().pets[0]?.id).toBe(createdPet.id);
    expect(usePetStore.getState().organizations[0]?.petIds).toContain(createdPet.id);
    expect(newNeed.petId).toBe(createdPet.id);
    expect(newTimelinePost.petId).toBe(createdPet.id);
    expect(usePetStore.getState().petLetters[0]?.petId).toBe(createdPet.id);
    expect(usePetStore.getState().reports[0]?.petId).toBe(createdPet.id);

    dashboardService.reset();

    expect(usePetStore.getState().pets).toHaveLength(initialAppData.pets.length);
    expect(usePetStore.getState().organizations[0]?.petIds).toEqual(
      initialAppData.organizations[0]?.petIds,
    );
  });

  it('filters pets using the same rules exposed to the UI', async () => {
    const cats = await petsService.list({ species: 'cat' });
    expect(cats.every((pet) => pet.species === 'cat')).toBe(true);

    const campinas = await petsService.list({ query: 'campinas' });
    expect(campinas.every((pet) => pet.city === 'Campinas')).toBe(true);

    const urgent = await petsService.list({ status: 'urgent' });
    expect(urgent.some((pet) => pet.slug === 'thor')).toBe(true);
  });
});
