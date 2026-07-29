import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  content:[
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  server: {
    port: 5174,
    host: true
  },
  theme: {extend:{}}
})
