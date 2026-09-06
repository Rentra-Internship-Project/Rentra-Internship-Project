const express = require('express');
const router = express.Router();

/**
 * Dedicated /ping Keep-Alive Handler (Best Practice for Render / Uptime Monitors)
 * - Ultra-lightweight & non-blocking (zero database or disk overhead)
 * - Cache-busting headers to prevent intermediate proxies/CDNs from serving cached 200s
 * - Handles both GET and HEAD requests seamlessly
 * - Returns ISO timestamp, uptime (seconds), and environment
 */
const pingHandler = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  return res.status(200).json({
    status: 'ok',
    message: 'pong',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
};

router.get('/', pingHandler);
router.head('/', pingHandler);

module.exports = {
  router,
  pingHandler,
};
