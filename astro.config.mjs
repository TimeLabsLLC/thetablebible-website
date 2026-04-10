// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://thetablebible.org',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.endsWith('/watch/'),
    }),
    pagefind(),
  ],
});
