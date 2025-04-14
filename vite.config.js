import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // <- isso garante a criação da pasta
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      external: ['axios']
    }
  }
});
