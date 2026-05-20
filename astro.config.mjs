// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/casper-api': {
          target: 'https://api.cas-per.it/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/casper-api/, '')
        }
      }
    }
  }
});
