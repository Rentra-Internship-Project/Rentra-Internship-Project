// Simple In-Memory Cache Store (Beginner Friendly)
// Replaced complex Redis implementation to keep the codebase simple for the college presentation.

const memoryCache = new Map();

const cacheWrapper = {
  isReady: () => true,
  
  set: async (key, val, ttlSeconds) => {
    memoryCache.set(key, val);
    
    // Optional: auto-delete after TTL
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

module.exports = cacheWrapper;
