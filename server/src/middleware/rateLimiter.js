// Redis Rate Limiting Middleware
const redisWrapper = require('../config/redis');

function rateLimiter(limit = 100, windowMs = 60000) {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const key = `rate_limit:${ip}`;
      // Use 15 minutes as per instructions, or fallback to windowMs in seconds if we wanted to be dynamic
      const ttl = 60 * 15;
      
      const current = await redisWrapper.get(key);
      
      if (current !== null && current !== undefined) {
        const count = parseInt(current, 10);
        if (count >= limit) {
          return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
        await redisWrapper.set(key, count + 1, ttl);
      } else {
        await redisWrapper.set(key, 1, ttl);
      }
      
      next();
    } catch (error) {
      console.error('Rate limiter Redis error:', error);
      // Fail open
      next();
    }
  };
}

module.exports = rateLimiter;
