// In-Memory Rate Limiting Middleware
const cache = require('../config/cache');

function rateLimiter(limit = 100, windowMs = 60000) {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const key = `rate_limit:${ip}`;
      // Use 15 minutes as per instructions, or fallback to windowMs in seconds if we wanted to be dynamic
      const ttl = 60 * 15;
      
      const current = await cache.get(key);
      
      if (current !== null && current !== undefined) {
        const count = parseInt(current, 10);
        if (count >= limit) {
          return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
        await cache.set(key, count + 1, ttl);
      } else {
        await cache.set(key, 1, ttl);
      }
      
      next();
    } catch (error) {
      console.error('Rate limiter cache error:', error);
      // Fail open
      next();
    }
  };
}

module.exports = rateLimiter;
