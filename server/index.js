const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { initSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize Socket.IO Server Engine
const io = initSocket(server);

// Connect to MongoDB Atlas (if MONGO_URI present) or fall back to db.json
connectDB();

// Start HTTP & WebSocket Server
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Rentra MERN REST API & Socket.IO Server on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}`);
  console.log(`====================================================`);
});

module.exports = { app, server, io };
