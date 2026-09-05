// Simple In-Memory Cache Store (Sliding-Window / TTL)
// Native JavaScript Map-based cache store for rate limiting and temporary key-value storage.
// Replaced external Redis infrastructure with a lightweight native store ($0 infrastructure cost).

const memoryCache = new Map();

const cache = {
  isReady: () => true,
  
  set: async (key, val, ttlSeconds) => {
    memoryCache.set(key, val);
    
    // Auto-delete after TTL expiration
    if (ttlSeconds) {
      setTimeout(() => {
        memoryCache.delete(key);
      }, ttlSeconds * 1000);
    }
  },
  
  get: async (key) => {
    return memoryCache.has(key) ? memoryCache.get(key) : null;
  },
  
  del: async (key) => {
    memoryCache.delete(key);
  },
};

module.exports = cache;
module.exports.cacheWrapper = cache;
