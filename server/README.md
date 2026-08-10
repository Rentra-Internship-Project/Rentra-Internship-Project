# Rentra — MERN + Redis + Socket.IO Enterprise Backend API Server

> **Complete Backend Technical Architecture & Master Specification**  
> Technology Stack: **Node.js 20+, Express 5, MongoDB (Mongoose 9), Redis 7, Socket.IO 4, JWT (with HttpOnly Refresh Cookies), Stripe Connect Escrow, Cloudinary, and BullMQ**  
> Supports **Dual Execution Modes**:
> - ⚡ **Evaluation Mode**: Zero-cost ($0), 1-command Express + Persistent Local Data Store (`server/data/db.json`) for rapid evaluation testing & professor demos.
> - 🚀 **Enterprise Production Mode**: Full-stack Mongoose models, Redis caching, Socket.IO notifications, and Stripe Connect escrow.

---

## 🛠️ Technology Stack Breakdown

- **Core Framework**: Node.js v20+ & Express 5 (REST API Gateway)
- **Database Layer**: MongoDB Atlas with Mongoose 9 ORM & `2dsphere` Geospatial Indexing
- **Caching & Queues**: Redis 7, `@socket.io/redis-adapter`, and BullMQ background queue workers
- **Real-Time Layer**: Socket.IO 4 with JWT Handshake Authentication
- **Security & Auth**: Dual JWTs (15-min Access Token + 7-day HttpOnly SameSite=Strict Refresh Cookie), bcryptjs, Helmet security headers, and Redis Rate Limiting
- **Payments & Escrow**: Stripe Connect Express & Webhooks API (`payment_intent.succeeded`, 20% deposit hold manual capture)
- **Storage & PDF**: Cloudinary API with Multer storage + PDFKit contract generator

---

## 🏗️ Exhaustive Directory Structure (`server/`)

```
server/
├── index.js                      # Application Entry Point & Server Launcher
├── package.json                  # Dependencies & Scripts
├── .env.example                  # Environment Template
├── data/
│   └── db.json                   # Persistent Local Evaluation DB Store
├── src/
│   ├── app.js                    # Express App Setup & Global Middlewares
│   ├── config/
│   │   ├── db.js                 # MongoDB Mongoose Connection Pool
│   │   ├── redis.js              # Redis Client Configuration (ioredis)
│   │   ├── socket.js             # Socket.IO Server & Redis Adapter
│   │   ├── cloudinary.js         # Cloudinary SDK Configuration
│   │   ├── stripe.js             # Stripe SDK Client Initializer
│   │   └── constants.js          # App Constants (Roles, Statuses, Fees)
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT Verification & Cookie Token Guard
│   │   ├── rbac.middleware.js    # Role-Based Access Control Guard (ADMIN, OWNER, CUSTOMER)
│   │   ├── rateLimiter.js        # Redis-Backed Rate Limiting Middleware
│   │   ├── upload.middleware.js  # Multer Storage & Cloudinary Pipeline
│   │   └── error.middleware.js   # Global Error & Async Exception Handler (Mongoose 11000)
│   ├── modules/
│   │   ├── auth/                 # Auth Routes, Controllers (Login, Register, Refresh, Logout)
│   │   ├── users/                # User Schemas & Profile Handlers
│   │   ├── businesses/           # Owner Business KYB Verification
│   │   ├── categories/           # Machinery Category Taxonomies
│   │   ├── equipment/            # Equipment Catalog, Mongoose 2dsphere Search & Bundles
│   │   ├── bookings/             # Bookings, Lowboy Hauling & Engine Overtime Calculator
│   │   ├── inspection/           # Digital E-Signature & Photo Inspection
│   │   ├── escrow/               # Payment Escrow & Stripe Connect Webhooks
│   │   ├── payouts/              # Owner Financial Earnings & Transfers
│   │   └── admin/                # Platform Analytics Aggregation ($facet)
│   └── jobs/
│       └── worker.js             # BullMQ Queue Processor (Email Notifications, PDFKit Contracts)
```

---

## 🗄️ Database Schemas & Core Features

### 1. Equipment Model (`src/modules/equipment/equipment.model.js`)
```javascript
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  dailyRate: { type: Number, required: true },
  
  // Unique Feature 1: Certified Operator Option
  operatorAvailable: { type: Boolean, default: false },
  operatorDailyRate: { type: Number, default: 150 },
  
  // Unique Feature 3: Lowboy Hauling Specs & PostGIS 2dsphere Location
  weightTons: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
  },
  images: [{ type: String }],
  status: { type: String, enum: ['AVAILABLE', 'RENTED', 'MAINTENANCE'], default: 'AVAILABLE' }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
```

### 2. Booking Model (`src/modules/bookings/booking.model.js`)
```javascript
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  durationDays: { type: Number, required: true },
  
  // Unique Feature Selections & Financial Breakdown
  includeOperator: { type: Boolean, default: false },
  distanceKm: { type: Number, default: 25 },
  haulingFee: { type: Number, required: true },
  rentalSubtotal: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  gstTax: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  
  // Unique Feature 4: Engine Hour Overtime Meter
  allowedEngineHours: { type: Number, default: 8 },
  loggedEngineHours: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  overtimeSurcharge: { type: Number, default: 0 },
  
  // Unique Feature 5: Digital E-Signature Inspection
  signatureDataUrl: { type: String, default: null },
  inspectionPhotos: [{ type: String }],
  
  paymentIntentId: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['PENDING_DEPOSIT', 'PENDING_OWNER_APPROVAL', 'APPROVED', 'ACTIVE', 'RETURNED_INSPECTED', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING_DEPOSIT' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
```

---

## 🚀 Quick Start Execution

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables (`server/.env`)**:
   ```env
   PORT=3000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGO_URI=mongodb://localhost:27017/rentra
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=super_secret_jwt_key_98765
   JWT_REFRESH_SECRET=super_secret_refresh_key_12345
   STRIPE_SECRET_KEY=sk_test_51...
   STRIPE_WEBHOOK_SECRET=whsec_...
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```

3. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   - Express Server running on: `http://localhost:3000`
   - Health Check route: `GET http://localhost:3000`
