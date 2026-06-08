/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ command }) => ({
  // GitHub Pages 專案站台服務於 /Borrowed-Light/;dev 用 '/'。
  // 可用環境變數 VITE_BASE 覆寫(例如改用自訂域名時設為 '/')。
  base: process.env.VITE_BASE ?? (command === 'build' ? '/Borrowed-Light/' : '/'),
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
}))
