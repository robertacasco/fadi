// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
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