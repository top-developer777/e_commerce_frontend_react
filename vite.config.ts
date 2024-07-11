import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

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
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
    },
  };
});
