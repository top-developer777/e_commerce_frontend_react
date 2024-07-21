import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    base: "/",
    build: {
      chunkSizeWarningLimit: 3000,
    },
    server: {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'ssl/vite.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'ssl/vite.crt')),
      },
      host: true,
      port: Number(env.VITE_PORT),
    },
  };
});
