import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { startVitest } from 'vitest/node';

await startVitest(
  'test',
  process.argv.slice(2),
  {
    config: false,
    root: process.cwd(),
    run: true,
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
  },
  {
    plugins: [react(), tailwindcss()],
  },
);
