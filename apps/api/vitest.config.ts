import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.e2e.test.ts'],
  },
  resolve: {
    conditions: ['node'],
  },
});
