import { afterEach, describe, expect, it, vi } from 'vitest';

const loadHttpModule = async () => {
  vi.resetModules();
  return import('./http');
};

describe('http client configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('defaults to the local api port used by the docker compose stack', async () => {
    const { publicHttp, http } = await loadHttpModule();

    expect(publicHttp.defaults.baseURL).toBe('http://localhost:8080/api');
    expect(http.defaults.baseURL).toBe('http://localhost:8080/api');
  });

  it('uses the configured VITE_API_BASE_URL when provided', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/v1');

    const { publicHttp, http } = await loadHttpModule();

    expect(publicHttp.defaults.baseURL).toBe('https://api.example.test/v1');
    expect(http.defaults.baseURL).toBe('https://api.example.test/v1');
  });
});
