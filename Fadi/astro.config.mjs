import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: process.env.BUILD_TARGET === 'docker' ? node({ mode: 'standalone' }) : vercel()
});
