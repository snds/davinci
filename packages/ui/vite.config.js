import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@davinci/ui': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry:   path.resolve(__dirname, 'src/index.js'),
      name:    'DavinciUI',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
