import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '../features/auth/auth-store';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiAuthPayload = {
  access_token?: string;
  refresh_token?: string | null;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const apiBaseUrl =
  typeof import.meta.env.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:8080/api';

const httpConfig: CreateAxiosDefaults = {
  baseURL: apiBaseUrl,
  timeout: 8000,
};

export const publicHttp: AxiosInstance = axios.create(httpConfig);
export const http: AxiosInstance = axios.create(httpConfig);

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const headers = AxiosHeaders.from(config.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  config.headers = headers;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const currentToken = useAuthStore.getState().accessToken;
    if (!currentToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await publicHttp.post<ApiEnvelope<ApiAuthPayload>>(
        '/auth/refresh',
        undefined,
        {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        },
      );

      const payload = refreshResponse.data?.result;
      const accessToken = payload?.access_token;
      const refreshToken = payload?.refresh_token ?? currentToken;

      if (typeof accessToken === 'string') {
        useAuthStore.getState().setTokens({
          accessToken,
          refreshToken: typeof refreshToken === 'string' ? refreshToken : currentToken,
        });
        originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);

        return http.request(originalRequest);
      }
    } catch {
      useAuthStore.getState().clearSession();
    }

    return Promise.reject(error);
  },
);
