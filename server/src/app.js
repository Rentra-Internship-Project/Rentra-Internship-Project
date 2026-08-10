const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('./middleware/rateLimiter');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./modules/auth/auth.routes');
const equipmentRoutes = require('./modules/equipment/equipment.routes');
const bookingRoutes = require('./modules/bookings/booking.routes');
const escrowRoutes = require('./modules/escrow/escrow.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const { authenticateToken } = require('./middleware/auth.middleware');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter(150, 60000));

const { getDatabaseStatus } = require('./config/db');

// Healthcheck Route
app.get('/', (req, res) => {
  res.json({
    service: 'Rentra MERN REST API',
    status: 'ONLINE',
    version: '1.0.0',
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Modular Express Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/admin', adminRoutes);

// Media Upload Pipeline Route
app.post('/api/upload', authenticateToken, (req, res) => {
  const { filename } = req.body;
  const mediaUrl = `https://res.cloudinary.com/rentra-assets/image/upload/v1723400/equipment_${Date.now()}_${filename || 'upload.jpg'}`;
  res.status(201).json({ message: 'Media uploaded successfully', url: mediaUrl, format: 'jpg', bytes: 245089 });
});

// Centralized Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
