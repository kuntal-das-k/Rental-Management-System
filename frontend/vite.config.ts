import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __SERVER_FORWARD_CONSOLE__: false,
  },
  server: {
    port: 3000,
    host: true,
  },
});

