/**
 * co-lab Vercel Serverless Function API Gateway
 *
 * Catches all /api/v1/* and /api/* requests on Vercel and forwards them
 * to the co-lab API router with full SHA-256 auth, CRUD endpoints, and CORS headers.
 */

import { handleApiRequest } from '../server/apiRouter.mjs';

export default async function handler(req, res) {
  // Ensure CORS headers are always set on every response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Razorpay-Signature, X-Webhook-Signature');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Normalize URL path to /api/v1/...
  if (req.url) {
    if (!req.url.startsWith('/api/v1')) {
      if (req.url.startsWith('/api')) {
        req.url = req.url.replace('/api', '/api/v1');
      } else {
        req.url = `/api/v1${req.url.startsWith('/') ? '' : '/'}${req.url}`;
      }
    }
  }

  try {
    const handled = await handleApiRequest(req, res);
    if (!handled && !res.writableEnded) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Endpoint not found on co-lab API' }));
    }
  } catch (err) {
    console.error('[Vercel Serverless Gateway Error]', err);
    if (!res.writableEnded) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
    }
  }
}

