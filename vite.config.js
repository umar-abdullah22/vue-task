import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@Components': fileURLToPath(
        new URL('./src/components', import.meta.url)
      ),
      '@Constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@Assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@Services': fileURLToPath(new URL('./src/services', import.meta.url)),
    },
  },
});
