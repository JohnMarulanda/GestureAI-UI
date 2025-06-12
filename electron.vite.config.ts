import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: ['**/*.task', 'src/renderer/assets/**', 'src/models/**'],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@/hooks': resolve('src/renderer/src/hooks'),
        '@/assets': resolve('src/renderer/src/assets'),
        '@/components': resolve('src/renderer/src/components'),
        '@/mocks': resolve('src/renderer/src/mocks'),
        '@/utils': resolve('src/renderer/src/utils'),
        '@/services': resolve('src/renderer/src/services')
      }
    },
    plugins: [react()],
    publicDir: resolve('src/renderer/public'),
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/renderer/index.html')
        }
      }
    }
  }
})
