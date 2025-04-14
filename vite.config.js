import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Garantir que a saída seja no diretório 'dist'
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      external: ['axios']
    }
  }
});
