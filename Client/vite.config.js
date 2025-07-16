import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import tailwindcss from '@tailwindcss/vite'
=======
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'

// Emulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
>>>>>>> final-wanderwise
export default defineConfig({
  plugins: [
    react(),tailwindcss(),
  ],
<<<<<<< HEAD
})
=======
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
>>>>>>> final-wanderwise
