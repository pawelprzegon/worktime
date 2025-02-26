import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
      '~': '/src'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})