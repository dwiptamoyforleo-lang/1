import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        features: resolve(__dirname, 'features.html'),
        about: resolve(__dirname, 'about.html'),
        showcase: resolve(__dirname, 'showcase.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        contact: resolve(__dirname, 'contact.html'),
        overview: resolve(__dirname, 'overview.html'),
        auth: resolve(__dirname, 'auth.html'),
      },
    },
  },
});
