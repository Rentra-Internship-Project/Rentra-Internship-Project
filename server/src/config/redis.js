// Redis Client Config & Session Cache Store
const activeTokens = new Set();

const redisClient = {
  isReady: true,
  set: async (key, val) => activeTokens.add(key),
  get: async (key) => activeTokens.has(key),
  del: async (key) => activeTokens.delete(key),
};

module.exports = redisClient;
