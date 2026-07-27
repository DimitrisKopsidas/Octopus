import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: true,
      // Mirrors `location /api/` in nginx.conf, so dev and prod are both
      // same-origin. Removes CORS from the dev loop, and lets the session
      // cookie travel without SameSite=None (v0.6.0 auth).
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
  },
})