import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from 'vite-plugin-vercel/vite';

export default defineConfig({
  plugins: [
    react(),
    vercel({
      rewrites: [{ source: '/(.*)', destination: '/index.html' }],
    }),
  ],
  build: {
    outDir: 'build',
  },
});
