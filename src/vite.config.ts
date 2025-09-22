import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular';

export default defineConfig({
  plugins: [angular()],
  build: {
    target: 'esnext', // Replace 'browserTarget' with 'buildTarget'
    outDir: 'dist',
  },
  optimizeDeps: {
    entries: ['src/main.ts'], // Ensure this points to your entry file
  },
 
  ssr: {
    noExternal: [
      'apexcharts', // Add other non-SSR compatible modules here
    ]
  },
});