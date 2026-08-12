const Redis = require('ioredis');

let redisClient = null;
let isRedisConnected = false;

const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD;

if (redisUrl || (redisHost && redisHost !== '127.0.0.1')) {
  try {
    const connectionTarget = redisUrl || {
      host: redisHost,
      port: Number(redisPort),
      password: redisPassword,
      tls: redisHost.includes('upstash.io') ? { rejectUnauthorized: false } : undefined,
    };

    redisClient = new Redis(connectionTarget, {
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
      connectTimeout: 5000,
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('⚡ Upstash Redis Cloud Connected via TLS!');
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      console.warn('⚠️ Redis Cloud Note:', err.message);
    });
  } catch (err) {
    console.warn('Fallback to memory cache:', err.message);
  }
}

// Fallback In-Memory Token & Rate-Limit Cache Store
const fallbackMemoryCache = new Set();

const redisWrapper = {
  isReady: () => isRedisConnected,
  set: async (key, val, ttlSeconds) => {
    if (isRedisConnected && redisClient) {
      try {
        if (ttlSeconds) {
          await redisClient.set(key, val, 'EX', ttlSeconds);
        } else {
          await redisClient.set(key, val);
        }
        return;
      } catch (e) {
        // Fallthrough to memory cache
      }
    }
    fallbackMemoryCache.add(key);
  },
  get: async (key) => {
    if (isRedisConnected && redisClient) {
      try {
        const val = await redisClient.get(key);
        return val;
      } catch (e) {
        // Fallthrough
      }
    }
    return fallbackMemoryCache.has(key) ? '1' : null;
  },
  del: async (key) => {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.del(key);
        return;
      } catch (e) {}
    }
    fallbackMemoryCache.delete(key);
  },
};

module.exports = redisWrapper;
