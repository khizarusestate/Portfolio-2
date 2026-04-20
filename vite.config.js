import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    rollupOptions: {
      external: ['framer-motion'],
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['framer-motion']
  }
})
