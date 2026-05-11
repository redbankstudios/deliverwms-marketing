// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://deliverwms.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap({
      // Hint search engines about update frequency and relative importance per route.
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Custom serialization for higher-priority pages
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname === '/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (['/features', '/pricing', '/compare'].includes(url.pathname)) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (url.pathname.startsWith('/docs')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (url.pathname.startsWith('/legal')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['lucide-react'],
    },
  },
});
