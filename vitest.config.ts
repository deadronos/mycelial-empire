import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    watch: false,
    include: ['tests/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    setupFiles: ['tests/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx,js}'],
      exclude: ['src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
});
