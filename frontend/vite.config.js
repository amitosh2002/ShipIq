import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/input': 'http://localhost:3000',
      '/optimize': 'http://localhost:3000',
      '/results': 'http://localhost:3000'
    }
  }
})
