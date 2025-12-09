import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load correctly on any path (e.g. /Test/ or /dnd-sim/)
  build: {
    outDir: 'dist',
  }
})