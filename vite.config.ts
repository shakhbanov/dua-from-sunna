import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5050,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        strategies: 'injectManifest',
        srcDir: 'src/sw',
        filename: 'service-worker.ts',
        manifest: false, // using public/manifest.webmanifest directly
        includeAssets: [
          'favicon.ico',
          'logo.svg',
          'icons/*.png',
          'splashes/*.png',
          'manifest.webmanifest',
          'robots.txt',
        ],
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest,woff2}'],
          globIgnores: ['**/*.map', '**/splashes/**', '**/sitemap.xml'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        devOptions: {
          enabled: false,
          type: 'module',
        },
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
