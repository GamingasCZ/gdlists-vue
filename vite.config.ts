import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(mode => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
    ],
    base: '/gdlists',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/gdlists/api': {
          target: env.VITE_ENDPOINT,
          changeOrigin: true,
          prependPath: true,
          cookieDomainRewrite: {
            "*": "http://localhost:8000"
          }
        }
      }
    },
  }

})
