import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base skal matche repo-navnet, ellers loader assets ikke korrekt på GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/pizza-helper/',
});
