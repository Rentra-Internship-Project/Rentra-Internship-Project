const http = require('http');
const https = require('https');

/**
 * Automated Keep-Alive Service for Render Free-Tier Web Services (Zero-Configuration).
 * 
 * Render spins down free web services after 15 minutes of inactivity.
 * When hosted on Render, Render automatically provides:
 *   - RENDER_EXTERNAL_URL (e.g. https://rentra-backend.onrender.com)
 *   - RENDER_EXTERNAL_HOSTNAME (e.g. rentra-backend.onrender.com)
 *   - RENDER_SERVICE_NAME (e.g. rentra-backend)
 * 
 * This worker detects Render's environment automatically, pings /ping every
 * 14 minutes (and once at boot after 30s) to keep the instance active 24/7.
 */
function resolveTargetUrl() {
  if (process.env.KEEP_ALIVE_URL) {
    return process.env.KEEP_ALIVE_URL;
  }
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }
  if (process.env.RENDER_EXTERNAL_HOSTNAME) {
    return `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
  }
  if (process.env.RENDER === 'true' && process.env.RENDER_SERVICE_NAME) {
    return `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`;
  }
  if (process.env.ENABLE_KEEP_ALIVE === 'true' && process.env.SERVER_URL) {
    return process.env.SERVER_URL;
  }
  return null;
}

function startKeepAlive() {
  const targetUrl = resolveTargetUrl();

  if (!targetUrl) {
    // Zero-config: Silently idle in local dev unless on Render or explicitly configured
    return null;
  }

  const cleanUrl = targetUrl.replace(/\/+$/, '');
  const pingEndpoint = `${cleanUrl}/ping`;
  const defaultIntervalMs = 14 * 60 * 1000; // 14 minutes (Render inactivity timeout is 15m)
  const intervalMs = parseInt(process.env.KEEP_ALIVE_INTERVAL_MS, 10) || defaultIntervalMs;

  console.log(`[Keep-Alive] 🚀 Zero-Config Auto Keep-Alive active!`);
  console.log(`[Keep-Alive] 🎯 Target Endpoint: ${pingEndpoint}`);
  console.log(`[Keep-Alive] ⏱️ Ping Interval: every ${Math.round(intervalMs / 60000)} minutes`);

  const sendPing = (isInitial = false) => {
    try {
      const client = pingEndpoint.startsWith('https') ? https : http;
      const req = client.get(
        pingEndpoint,
        { timeout: 15000, agent: false, headers: { Connection: 'close' } },
        (res) => {
          // Drain response data to free sockets and prevent memory leakage
          res.resume();
          if (res.statusCode === 200) {
            console.log(
              `[Keep-Alive] ✅ ${isInitial ? 'Initial verification' : 'Keep-alive'} ping successful (${res.statusCode}) at ${new Date().toISOString()}`
            );
          } else {
            console.warn(`[Keep-Alive] ⚠️ Ping returned status ${res.statusCode}`);
          }
        }
      );

      req.on('error', (err) => {
        console.warn(`[Keep-Alive] ⚠️ Ping request failed: ${err.message}`);
      });

      req.on('timeout', () => {
        req.destroy();
        console.warn('[Keep-Alive] ⚠️ Ping request timed out');
      });
    } catch (err) {
      console.warn(`[Keep-Alive] ⚠️ Unexpected ping error: ${err.message}`);
    }
  };

  // Run initial verification ping 30 seconds after boot (or earlier if customized)
  const initialDelayMs = parseInt(process.env.KEEP_ALIVE_INITIAL_DELAY_MS, 10) || 30 * 1000;
  const initialTimer = setTimeout(() => sendPing(true), initialDelayMs);
  if (initialTimer.unref) {
    initialTimer.unref();
  }

  // Schedule regular periodic pings every 14 minutes
  const intervalId = setInterval(() => sendPing(false), intervalMs);
  if (intervalId.unref) {
    intervalId.unref();
  }

  return { intervalId, initialTimer, targetUrl: pingEndpoint };
}

module.exports = { startKeepAlive, resolveTargetUrl };
