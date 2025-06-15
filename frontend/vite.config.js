import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'



export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        theme: {
          extend: {
            colors: {
              primary: '#5f6FFF', // Your custom color
            },
          },
        },
      },
    }),
  ],
})