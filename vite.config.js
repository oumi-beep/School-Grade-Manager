import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration Vite
export default defineConfig({
  plugins: [react()],

  server: {
    // Port sur lequel Vite servira l'application frontend
    port: 5173,

    // Configuration du proxy pour rediriger les requêtes API vers le backend
    proxy: {
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true,              
      },
    },
  },
});
