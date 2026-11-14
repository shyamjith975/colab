import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Custom Vite plugin to handle /api/v1 routes backed by SQLite colab.db
function colabSqliteApiPlugin() {
  return {
    name: 'colab-sqlite-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api/v1')) {
          try {
            const { handleApiRequest } = await import('./server/apiRouter.mjs');
            const handled = await handleApiRequest(req, res);
            if (handled || res.writableEnded) return;
          } catch (err) {
            console.error('[Vite SQLite API Error]', err);
          }
          if (res.writableEnded) return;
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), colabSqliteApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});


