import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-removebg.png'],
      manifest: {
        name: 'Chatorzzz E-commerce',
        short_name: 'Chatorzzz',
        description: 'The ultimate candy universe experience.',
        theme_color: '#d946ef',
        icons: [
          {
            src: 'logo-removebg.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-removebg.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  define: {
    global: 'globalThis',
  },
});
