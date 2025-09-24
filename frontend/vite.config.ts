import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5200',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
          editor: ['@monaco-editor/react', 'monaco-editor'],
          utils: ['axios', 'zustand', '@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'axios',
      '@tanstack/react-query',
      'react-hot-toast',
      '@monaco-editor/react',
      'monaco-editor',
      'highlight.js',
      'marked',
      'dompurify',
      'framer-motion',
      'lucide-react',
      '@headlessui/react',
      'clsx',
    ],
  },
})
