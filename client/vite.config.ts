import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: '0.0.0.0',
    watch: {
      usePolling: true,  // Enable polling for file changes in Docker
      interval: 1000,    // Check for changes every second
    },
    proxy: {
      '/api': {
        target: 'http://server:8080',  // Updated to use the Docker service name and correct port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    hmr: {
      clientPort: 4000,  // Ensure HMR WebSocket connects to the correct port
    },
  },
}) 