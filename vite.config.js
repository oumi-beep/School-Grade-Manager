
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    port: 5173,
=======
    port: 5173, 
>>>>>>> d7d2796d4d0266029cc8eb62d54e614f35750225
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
<<<<<<< HEAD
})
=======
})
>>>>>>> d7d2796d4d0266029cc8eb62d54e614f35750225
