import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

const securityHeaders = {
  'Content-Security-Policy': "frame-ancestors 'none'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      filename: 'remoteEntry.js',
      exposes: {
        './apiClient': './src/core/http/apiClient.ts'
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: {
    port: 3000,
    host: true,
    headers: securityHeaders
  },
  preview: {
    headers: securityHeaders
  },
  build: {
    target: 'esnext'
  }
});
