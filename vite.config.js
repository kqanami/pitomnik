import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),
        catalog:  resolve(__dirname, 'catalog.html'),
        gallery:  resolve(__dirname, 'gallery.html'),
        services: resolve(__dirname, 'services.html'),
        contacts: resolve(__dirname, 'contacts.html'),
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true
  }
})
