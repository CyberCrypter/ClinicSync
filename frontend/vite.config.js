import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        content: [
          './index.html',
          './src/**/*.{js,jsx,ts,tsx}',
        ],
        theme: {
          extend: {
            colors: {
              primary: '#',
            },
          },
        },
      },
    }),
  ],
  server: {
    port: 5173,
  },
})