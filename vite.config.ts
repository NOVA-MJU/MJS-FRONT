import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from 'vite-plugin-sitemap';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://mjsearch.org',
      dynamicRoutes: [
        '/board',
        '/board/write',
        '/notice',
        '/news',
        '/login',
        '/broadcast',
        '/register',
        '/find-password',
        '/menu',
        '/academic-calendar',
        '/department',
        '/search',
      ],
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@public', replacement: path.resolve(__dirname, 'public') },
    ],
  },
});
