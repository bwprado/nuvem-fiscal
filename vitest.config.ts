import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local for integration tests
config({ path: resolve(__dirname, '.env.local') });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
  },
});
