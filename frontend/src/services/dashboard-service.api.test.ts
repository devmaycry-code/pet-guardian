import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { dashboardService } from './dashboard-service';

const httpMock = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock('./http', () => ({
  http: {
    post: httpMock.post,
  },
}));

const response = (result: unknown) => ({
  data: {
    result,
  },
});

type PetRequestBody = {
  organization_id?: number;
  name?: string;
  slug?: string;
  species?: string;
  gender?: string;
  age?: string;
  size?: string;
  story?: string;
  rescue_story?: string;
  avatar?: string;
  city?: string;
  state?: string;
  title?: string;
  description?: string;
  type?: string;
  goal_amount?: number;
  current_amount?: number;
  urgency_level?: string;
  status?: string;
  proof_required?: boolean;
  content?: string;
  avatar_file?: File | null;
};

const isFormData = (value: unknown): value is FormData => value instanceof FormData;

const getFormText = (body: FormData, key: string): string | undefined => {
  const value = body.get(key);

  return typeof value === 'string' ? value : undefined;
};

describe('dashboardService api integration', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
    usePetStore.getState().resetData();
    httpMock.post.mockReset();
    useAuthStore.getState().setTokens({
      accessToken: 'token',
      refreshToken: 'refresh',
    });
  });

  it('persists dashboard creations through the API and merges the returned records', async () => {
    const organizationId = '1';

    usePetStore.getState().mergeRemoteOrganizations([
      {
        id: organizationId,
        slug: 'ong-teste',
        name: 'ONG Teste',
        kind: 'ngo',
        description: 'Organizacao de teste',
        city: 'Curitiba',
        state: 'PR',
        trustLevel: 'verified',
        transparencyScore: 88,
        verifiedSince: '2024-01-01',
        petIds: [],
      },
    ]);

    httpMock.post.mockImplementation((url: string, body?: PetRequestBody | FormData) => {
      const request = isFormData(body) ? undefined : body;

      if (url === '/pets') {
        const avatar = isFormData(body) ? body.get('avatar_file') : request?.avatar;

        return response({
          id: 901,
          organization_id: organizationId,
          temporary_home_id: null,
          name: request?.name,
          slug: request?.slug,
          species: request?.species,
          gender: request?.gender,
          age: request?.age,
          size: request?.size,
          status: 'available',
          urgency_level: 'medium',
          story: request?.story,
          rescue_story: request?.rescue_story,
          avatar,
          city: request?.city,
          state: request?.state,
          verified: true,
          followers_count: 3,
          sponsorships_count: 1,
          organization: {
            id: organizationId,
            name: 'ONG Teste',
            slug: 'ong-teste',
            description: 'Organizacao de teste',
            city: 'Curitiba',
            state: 'PR',
            verified: true,
            trust_score: 92,
            transparency_score: 88,
          },
        });
      }

      if (url.endsWith('/needs')) {
        return response({
          id: 501,
          pet_id: 901,
          title: request?.title,
          description: request?.description,
          type: request?.type,
          goal_amount: request?.goal_amount,
          current_amount: request?.current_amount,
          urgency_level: request?.urgency_level,
          status: request?.status,
          proof_required: request?.proof_required,
        });
      }

      if (url.endsWith('/timeline')) {
        return response({
          id: 601,
          pet_id: 901,
          title: request?.title,
          content: request?.content,
          type: request?.type,
          image: null,
          created_at: '2026-05-18T12:00:00.000Z',
        });
      }

      throw new Error(`unexpected url: ${url}`);
    });

    const createdPet = await dashboardService.createPet({
      name: 'Pingo',
      species: 'cat',
      city: 'Curitiba',
      state: 'PR',
      summary: 'Resumo curto',
      story: 'Historia do pet',
      organizationId,
    });

    const createdNeed = await dashboardService.addNeed({
      petId: createdPet.id,
      title: 'Racao',
      description: 'Racao para a fase atual.',
      estimatedAmount: 120,
    });

    const createdTimelinePost = await dashboardService.addTimelinePost({
      petId: createdPet.id,
      title: 'Primeiro dia',
      content: 'Pet se adaptou bem.',
    });

    expect(httpMock.post).toHaveBeenCalledWith(
      '/pets',
      expect.objectContaining({
        organization_id: 1,
        name: 'Pingo',
        slug: 'pingo',
      }),
    );
    expect(createdPet.remoteId).toBe('901');
    expect(usePetStore.getState().pets[0]?.remoteId).toBe('901');
    expect(usePetStore.getState().organizations.find((org) => org.id === organizationId)?.petIds).toContain(createdPet.id);
    expect(createdNeed.petId).toBe(createdPet.id);
    expect(usePetStore.getState().needs[0]?.id).toBe('501');
    expect(usePetStore.getState().needs[0]?.petId).toBe(createdPet.id);
    expect(createdTimelinePost.petId).toBe(createdPet.id);
    expect(usePetStore.getState().timelinePosts[0]?.id).toBe('601');
    expect(usePetStore.getState().timelinePosts[0]?.petId).toBe(createdPet.id);
  });

  it('submits avatar files as multipart form data when provided', async () => {
    const organizationId = '1';
    const avatarFile = new File(['fake-image'], 'luna.jpg', { type: 'image/jpeg' });

    usePetStore.getState().mergeRemoteOrganizations([
      {
        id: organizationId,
        slug: 'ong-teste',
        name: 'ONG Teste',
        kind: 'ngo',
        description: 'Organizacao de teste',
        city: 'Curitiba',
        state: 'PR',
        trustLevel: 'verified',
        transparencyScore: 88,
        verifiedSince: '2024-01-01',
        petIds: [],
      },
    ]);

    httpMock.post.mockImplementation((url: string, body?: PetRequestBody | FormData) => {
      if (url !== '/pets') {
        throw new Error(`unexpected url: ${url}`);
      }

      if (!isFormData(body)) {
        throw new Error('expected FormData body');
      }

      expect(body.get('avatar_file')).toBe(avatarFile);
      expect(body.get('name')).toBe('Pingo');

      return response({
        id: 902,
        organization_id: organizationId,
        temporary_home_id: null,
        name: getFormText(body, 'name'),
        slug: getFormText(body, 'slug'),
        species: getFormText(body, 'species'),
        gender: getFormText(body, 'gender'),
        age: getFormText(body, 'age'),
        size: getFormText(body, 'size'),
        status: 'available',
        urgency_level: 'medium',
        story: getFormText(body, 'story'),
        rescue_story: getFormText(body, 'rescue_story'),
        avatar: 'http://localhost/storage/pets/1/avatars/avatar.jpg',
        city: getFormText(body, 'city'),
        state: getFormText(body, 'state'),
        verified: true,
        followers_count: 0,
        sponsorships_count: 0,
        organization: {
          id: organizationId,
          name: 'ONG Teste',
          slug: 'ong-teste',
          description: 'Organizacao de teste',
          city: 'Curitiba',
          state: 'PR',
          verified: true,
          trust_score: 92,
          transparency_score: 88,
        },
      });
    });

    const createdPet = await dashboardService.createPet({
      name: 'Pingo',
      species: 'cat',
      city: 'Curitiba',
      state: 'PR',
      summary: 'Resumo curto',
      story: 'Historia do pet',
      organizationId,
      avatarFile,
    });

    expect(createdPet.remoteId).toBe('902');
  });
});
