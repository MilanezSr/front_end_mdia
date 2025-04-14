import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Definindo explicitamente o diretório de saída
    chunkSizeWarningLimit: 10000, // Definindo o limite para 10000KB (10MB)
    rollupOptions: {
      external: ['axios'] // Caso queira manter o axios como dependência externa
    }
  }
});
