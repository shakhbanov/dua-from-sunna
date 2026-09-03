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
          // Precache only the SPA shell + assets. Prerendered chapter pages
          // (/<slug>/index.html, /en/<slug>/index.html) are NOT precached —
          // NavigationRoute in service-worker.ts handles them via NetworkFirst
          // with a runtime cache fallback, which keeps the SW install fast.
          globPatterns: [
            'index.html',
            'assets/**/*.{js,css}',
            'icons/*.png',
            'logo.svg',
            'favicon.ico',
            'manifest.webmanifest',
            'robots.txt',
          ],
          globIgnores: ['**/*.map', '**/splashes/**', '**/sitemap.xml'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        devOptions: {
          enabled: false,
          type: 'module',
        },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          // The corpus is the bulk of the bundle and it changes on a different
          // cadence from the app code and the vendor libraries. Splitting the
          // three means a chapter edit no longer invalidates the cached React
          // runtime, and the reader UI parses without waiting on 170 chapters.
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              if (/\/data\/(chapters|quran)\//.test(id)) return 'content';
              return undefined;
            }
            if (/\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
            if (/\/(adhan|lucide-react)\//.test(id)) return 'vendor-app';
            return undefined;
          },
        },
      },
    },
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
