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
  user?: ApiUser;
};

type ApiUser = Parameters<typeof mapApiUserToLocalUser>[0];

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await publicHttp.post<ApiEnvelope<ApiAuthPayload>>('/auth/login', credentials);
    const payload = response.data?.result;
    const accessToken = payload?.access_token;
    const refreshToken = payload?.refresh_token ?? payload?.access_token ?? null;

    useAuthStore.getState().setTokens({
      accessToken: typeof accessToken === 'string' ? accessToken : null,
      refreshToken: typeof refreshToken === 'string' ? refreshToken : null,
    });

    if (payload?.user) {
      const hydratedUser = mapApiUserToLocalUser(payload.user, null);
      useAuthStore.getState().setCurrentUser(hydratedUser);
      return hydratedUser;
    }

    return this.restoreSession();
  },

  async restoreSession(): Promise<User | null> {
    const { currentUser, accessToken } = useAuthStore.getState();

    if (!accessToken) {
      return currentUser ?? null;
    }

    try {
      const response = await http.get<ApiEnvelope<ApiUser>>('/auth/me');
      const apiUser = response.data?.result;

      if (apiUser) {
        const hydratedUser = mapApiUserToLocalUser(apiUser, currentUser);
        useAuthStore.getState().setCurrentUser(hydratedUser);
        return hydratedUser;
      }
    } catch (error) {
      const status = (error as { response?: { status?: number } } | null)?.response?.status;

      if (status === 401 || status === 403) {
        useAuthStore.getState().clearSession();
      }

      return null;
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
