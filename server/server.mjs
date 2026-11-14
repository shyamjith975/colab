/**
 * co-lab Standalone API Server
 *
 * Runs an HTTP server on port 5000 providing the /api/v1 REST interface
 * backed directly by SQLite 'colab.db'.
 * Usage: "node server/server.mjs" or "npm run server"
 */

import http from 'node:http';
import { handleApiRequest } from './apiRouter.mjs';
import { getDatabaseStats } from './db.mjs';

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  const handled = await handleApiRequest(req, res);
  if (!handled) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found. Please access /api/v1 endpoints.' }));
  }
});

server.listen(PORT, () => {
  const stats = getDatabaseStats();
  console.log(`=======================================================`);
  console.log(`🚀 co-lab SQLite Backend Server is LIVE on port ${PORT}`);
  console.log(`📦 Database: ${stats.path} (${stats.fileSizeFormatted})`);
  console.log(`🌐 Base API: http://localhost:${PORT}/api/v1`);
  console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/v1/health`);
  console.log(`=======================================================`);
});

