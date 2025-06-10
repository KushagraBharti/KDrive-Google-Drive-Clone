// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // ------------------------------------------------------------------
  // 1️⃣  Load .env files for the active mode (development / production)
  //      – Vite automatically exposes variables that start with VITE_
  // ------------------------------------------------------------------
  const env = loadEnv(mode, process.cwd(), '')

  const BACKEND_URL =
    env.VITE_API_URL ||                 // allow override in .env
    (mode === 'development'
      ? 'http://localhost:3001'         // local Fastify dev-server
      : '')                             // prod → same origin on Vercel
  
  return {
    // ----------------------------------------------------------------
    // 2️⃣  Plugins (React fast refresh, TSX transform, SWC under the hood)
    // ----------------------------------------------------------------
    plugins: [react()],
    
    // ----------------------------------------------------------------
    // 3️⃣  Path aliases  ( '@/foo' → 'src/foo' )
    // ----------------------------------------------------------------
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    // ----------------------------------------------------------------
    // 4️⃣  Dev-server tweaks
    //     - Runs on 5173 by default
    //     - Proxies API calls & PostHog ingest to the Fastify backend
    // ----------------------------------------------------------------
    server: {
      port: 5173,
      open: true,
      strictPort: true,
      proxy: {
        // API → Fastify
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        // Analytics proxy (Phase 7) – keeps PostHog requests same-origin
        '/ingest': {
          target: 'https://app.posthog.com',
          changeOrigin: true,
          secure: true,
        },
      },
    },

    // ----------------------------------------------------------------
    // 5️⃣  Build optimisations
    // ----------------------------------------------------------------
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      target: 'esnext',          // modern browsers (ES2020+)
      assetsInlineLimit: 8 * 1024,
    },

    // ----------------------------------------------------------------
    // 6️⃣  Dependency pre-bundling
    // ----------------------------------------------------------------
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
        'lucide-react',
        'clsx',
        'class-variance-authority',
      ],
    },

    // ----------------------------------------------------------------
    // 7️⃣  Global constant replacements
    // ----------------------------------------------------------------
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    // ----------------------------------------------------------------
    // 8️⃣  Test configuration (Vitest) – optional but handy
    //     Requires:  yarn add -D vitest @testing-library/react
    // ----------------------------------------------------------------
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/__tests__/setup.ts',
      css: false,
    },
  }
})
