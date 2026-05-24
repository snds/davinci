import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Served under /davinci/app/ on GitHub Pages; relative base keeps assets portable.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Resolve workspace packages to source for hot reload + Tailwind scanning.
      '@davinci/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@davinci/tokens': path.resolve(__dirname, '../../packages/tokens'),
    },
  },
  server: {
    fs: {
      // Allow serving token/asset files from the repo root.
      allow: [path.resolve(__dirname, '../../')],
    },
  },
});
