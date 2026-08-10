function errorMiddleware(err, req, res, next) {
  console.error('💥 Centralized Error Handler:', err.stack || err);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Mongoose Validation Error', details: errors });
  }

  // MongoDB Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({ error: `Duplicate key error: ${field} already exists.` });
  }

  // Default Internal Error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorMiddleware;
