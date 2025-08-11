import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for Electron to load assets correctly
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  // Ensure compatibility with Electron
  define: {
    global: 'globalThis',
  },
});
