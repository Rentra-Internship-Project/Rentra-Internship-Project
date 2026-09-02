const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('./middleware/rateLimiter');
const errorMiddleware = require('./middleware/errorMiddleware');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');
const businessRoutes = require('./routes/business.routes');
const razorpayRoutes = require('./routes/razorpay.routes');
const categoryRoutes = require('./routes/category.routes');
const notificationRoutes = require('./routes/notification.routes');
const chatRoutes = require('./routes/chat.routes');
const { authenticateToken } = require('./middleware/auth.middleware');

const app = express();

// Middlewares
app.use(helmet());
// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(
  session({
    secret: process.env.JWT_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(rateLimiter(2000, 60000));

const { getDatabaseStatus } = require('./config/db');

// Healthcheck Route
app.get('/', (req, res) => {
  res.json({
    service: 'Rentra MERN REST API',
    status: 'ONLINE',
    version: '2.0.0',
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Modular Express Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
// Note: /api/escrow removed — Razorpay replaces Stripe

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Media Upload Pipeline Route
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'rentra_equipment'
    });

    res.status(201).json({
      message: 'Media uploaded successfully',
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Centralized Error Handling Middleware
app.use('/api/*', (req, res) => res.status(404).json({ error: 'API route not found' }));
app.use(errorMiddleware);

module.exports = app;
