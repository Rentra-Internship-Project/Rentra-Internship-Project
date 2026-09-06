require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { initSocket } = require('./src/config/socket');
const { startKeepAlive } = require('./src/utils/keepAlive');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize Socket.IO Server Engine
const io = initSocket(server);
app.set('io', io);

// Connect to MongoDB Atlas (if MONGO_URI present) or fall back to db.json
connectDB();

// Start HTTP & WebSocket Server
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Rentra MERN REST API & Socket.IO Server on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}`);
  console.log(`🏓 Keep-Alive Ping: http://localhost:${PORT}/ping`);
  console.log(`====================================================`);

  // Start automated keep-alive self-pinger if running on Render / configured
  startKeepAlive();
});

module.exports = { app, server, io };
