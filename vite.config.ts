import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Fail rather than silently taking the next port, so the URL printed
    // is the URL that works.
    strictPort: true
  },
  build: {
    outDir: 'dist'
  }
});
