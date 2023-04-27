import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_VUE_APP_BASE_URL || '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@':  path.resolve(__dirname, './src'),
      vue: 'vue/dist/vue.esm-bundler.js',
    }
  }
})
