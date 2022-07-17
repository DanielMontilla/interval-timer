import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
   base: '/interval-timer/',
   plugins: [
      vue(),
      VitePWA({
         registerType: 'autoUpdate',
         includeAssets: ['fonts/*.ttf', 'icons/*.svg'],
         workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
         },
         manifest: {
            name: 'Interval App',
            short_name: 'interval',
            description: 'interval app for working out',
            theme_color: '#0D1112',
            icons: [
               {
                  src: 'resources/android-chrome-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any',
               },
               {
                  src: 'android-chrome-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any',
               },
               {
                  src: 'icons/add.svg',
                  sizes: 'any',
                  type: 'image/svg+xml',
                  purpose: 'any',
               },
            ],
         },
      }),
   ],
   resolve: {
      alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
   },
});
