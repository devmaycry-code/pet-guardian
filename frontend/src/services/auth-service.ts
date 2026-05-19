import { initialAppData } from '../mocks/data';
import type { User } from '../types/domain';
import { useAuthStore } from '../features/auth/auth-store';
import { http, publicHttp } from './http';
import { mapApiUserToLocalUser } from './api-mappers';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiAuthPayload = {
  access_token?: string;
  refresh_token?: string | null;
};

type ApiUser = Parameters<typeof mapApiUserToLocalUser>[0];

const profileCredentials: Record<
  string,
  {
    email: string;
    password: string;
  }
> = {
  'user-marina': {
    email: 'user@petguardian.local',
    password: 'password',
  },
  'user-diego': {
    email: 'ong@petguardian.local',
    password: 'password',
  },
  'user-lais': {
    email: 'lar@petguardian.local',
    password: 'password',
  },
};

export const authService = {
  listProfiles(): User[] {
    return initialAppData.users;
  },

  login(profileId: string) {
    const user = initialAppData.users.find((entry) => entry.id === profileId) ?? null;
    useAuthStore.getState().loginAs(profileId);
    return user;
  },

  async loginWithSelectedProfile(profileId: string) {
    const profile = initialAppData.users.find((entry) => entry.id === profileId) ?? null;
    const credentials = profileCredentials[profileId];

    if (!profile || !credentials) {
      return this.login(profileId);
    }

    try {
      const response = await publicHttp.post<ApiEnvelope<ApiAuthPayload>>('/auth/login', credentials);
      const payload = response.data?.result;
      const accessToken = payload?.access_token;
      const refreshToken = payload?.refresh_token ?? payload?.access_token ?? null;

      if (typeof accessToken === 'string') {
        useAuthStore.getState().setTokens({
          accessToken,
          refreshToken: typeof refreshToken === 'string' ? refreshToken : null,
        });
      }

      const hydrated = await this.restoreSession(profile);
      return hydrated ?? profile;
    } catch {
      return this.login(profileId);
    }
  },

  async restoreSession(fallbackUser?: User | null) {
    const { currentUser, accessToken } = useAuthStore.getState();

    if (!accessToken) {
      return currentUser ?? fallbackUser ?? null;
    }

    try {
      const response = await http.get<ApiEnvelope<ApiUser>>('/auth/me');
      const apiUser = response.data?.result;

      if (apiUser) {
        const hydratedUser = mapApiUserToLocalUser(apiUser, fallbackUser ?? currentUser);
        useAuthStore.getState().setCurrentUser(hydratedUser);
        return hydratedUser;
      }
    } catch (error) {
      const status = (error as { response?: { status?: number } } | null)?.response?.status;

      if (status === 401 || status === 403) {
        useAuthStore.getState().clearSession();
      }

      return fallbackUser ?? currentUser ?? null;
    }

    return currentUser;
  },

  async logout() {
    const { accessToken } = useAuthStore.getState();

    try {
      if (accessToken) {
        await publicHttp.post(
          '/auth/logout',
          undefined,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      }
    } finally {
      useAuthStore.getState().clearSession();
    }
  },
};
