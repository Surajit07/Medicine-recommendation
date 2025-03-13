import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 5173,  
    strictPort: true, // Avoid port conflicts
    proxy: {
      '/api': 'http://127.0.0.1:8080', // Proxy API calls to FastAPI backend
    }
  },
  plugins: [react()],
});
