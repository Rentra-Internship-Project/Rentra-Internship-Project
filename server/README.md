# Rentra — Backend Technical Architecture & Master Build Blueprint

> **Complete Implementation Specification & Developer Guide for Rentra Backend**
> Technology Stack: **Node.js, Express 5, MongoDB (Mongoose 9), Redis, Socket.IO, Multer, Cloudinary, Stripe**
> Designed for a **4-Developer Team**.

---

## Table of Contents

1. [Exhaustive Backend File &amp; Directory Structure](#1-exhaustive-backend-file--directory-structure)
2. [Database Schema Definitions (Mongoose Models)](#2-database-schema-definitions-mongoose-models)
3. [Core Business Logic Algorithms &amp; Implementation Code](#3-core-business-logic-algorithms--implementation-code)
   - [A. Date Overlap Availability Search Engine](#a-date-overlap-availability-search-engine)
   - [B. Booking Financial Breakdown Calculator](#b-booking-financial-breakdown-calculator)
   - [C. Payment Gateway &amp; Escrow Webhook Handler](#c-payment-gateway--escrow-webhook-handler)
   - [D. Multi-File Cloud Storage Middleware](#d-multi-file-cloud-storage-middleware)
   - [E. Socket.IO Real-Time Notification Server](#e-socketio-real-time-notification-server)
   - [F. Admin Analytics Aggregation Pipelines](#f-admin-analytics-aggregation-pipelines)
4. [Granular Step-by-Step Build Instructions for Team of 4](#4-granular-step-by-step-build-instructions-for-team-of-4)
   - [Member 1: Core Architecture, Auth, Security &amp; User Governance](#member-1-core-architecture-auth-security--user-governance)
   - [Member 2: Equipment Catalog, Media Storage &amp; Search Engine](#member-2-equipment-catalog-media-storage--search-engine)
   - [Member 3: Booking State Machine, Payment Gateway &amp; Escrow Engine](#member-3-booking-state-machine-payment-gateway--escrow-engine)
   - [Member 4: Business KYC, Admin Moderation, Socket.IO &amp; Analytics](#member-4-business-kyc-admin-moderation-socketio--analytics)
5. [Complete API Endpoints Specification](#5-complete-api-endpoints-specification)
6. [Production Deployment &amp; Database Seeding Blueprint](#6-production-deployment--database-seeding-blueprint)

---

## 1. Exhaustive Backend File & Directory Structure

Create the following file tree inside the `server/` directory:

```
server/
├── index.js                      # Application Entry Point & Cluster Launcher
├── package.json                  # Dependencies & Scripts
├── .env.example                  # Environment Template
├── .gitignore
├── README.md                     # Backend Master Documentation & Setup Guide
├── src/
│   ├── app.js                    # Express App Setup & Global Middlewares
│   ├── config/
│   │   ├── db.js                 # MongoDB Mongoose Connection Pool
│   │   ├── redis.js              # Redis Client Configuration
│   │   ├── cloudinary.js         # Cloudinary SDK Configuration
│   │   ├── stripe.js             # Stripe SDK Client Initializer
│   │   └── constants.js          # App Constants (Roles, Statuses, Fees)
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Verification & Redis Token Blacklist Guard
│   │   ├── rbacMiddleware.js     # Role-Based Access Control Guard
│   │   ├── uploadMiddleware.js   # Multer Memory Storage & Cloudinary Pipe
│   │   ├── validateMiddleware.js # Express-Validator Middleware Wrapper
│   │   ├── errorMiddleware.js    # Global Error & Async Exception Handler
│   │   └── rateLimiter.js        # Redis-backed Express Rate Limiter
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── users/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   └── user.routes.js
│   │   ├── businesses/
│   │   │   ├── business.model.js
│   │   │   ├── business.controller.js
│   │   │   ├── business.service.js
│   │   │   └── business.routes.js
│   │   ├── categories/
│   │   │   ├── category.model.js
│   │   │   ├── category.controller.js
│   │   │   ├── category.service.js
│   │   │   └── category.routes.js
│   │   ├── equipment/
│   │   │   ├── equipment.model.js
│   │   │   ├── equipment.controller.js
│   │   │   ├── equipment.service.js
│   │   │   └── equipment.routes.js
│   │   ├── bookings/
│   │   │   ├── booking.model.js
│   │   │   ├── booking.controller.js
│   │   │   ├── booking.service.js
│   │   │   └── booking.routes.js
│   │   ├── escrow/
│   │   │   ├── escrow.model.js
│   │   │   ├── escrow.controller.js
│   │   │   ├── escrow.service.js
│   │   │   └── escrow.routes.js
│   │   ├── payouts/
│   │   │   ├── payout.model.js
│   │   │   ├── payout.controller.js
│   │   │   ├── payout.service.js
│   │   │   └── payout.routes.js
│   │   ├── wishlist/
│   │   │   ├── wishlist.model.js
│   │   │   ├── wishlist.controller.js
│   │   │   └── wishlist.routes.js
│   │   ├── notifications/
│   │   │   ├── notification.model.js
│   │   │   ├── notification.controller.js
│   │   │   ├── notification.service.js
│   │   │   └── socket.js        # Socket.IO Handlers & Event Emitters
│   │   └── admin/
│   │       ├── admin.controller.js
│   │       ├── admin.service.js
│   │       └── admin.routes.js
│   ├── utils/
│   │   ├── apiResponse.js        # Standardized Response Helpers (Success/Error)
│   │   ├── apiError.js           # Custom Operational Error Class
│   │   ├── invoiceGenerator.js   # PDFkit Rental Invoice Renderer
│   │   └── seedData.js           # Database Initializer Seed Script
```

---

## 2. Database Schema Definitions (Mongoose Models)

### `User.js` (`src/modules/users/user.model.js`)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
  status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
  stripeCustomerId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### `Business.js` (`src/modules/businesses/business.model.js`)

```javascript
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true, trim: true },
  gstNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  website: { type: String, default: '' },
  kycStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  kycDocuments: [{ type: String, required: true }], // PDF or Image URLs
  rejectionReason: { type: String, default: '' },
  verifiedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
```

### `Equipment.js` (`src/modules/equipment/equipment.model.js`)

```javascript
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true, trim: true, index: 'text' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  description: { type: String, required: true },
  pricePerDay: { type: Number, required: true, min: 0 },
  depositAmount: { type: Number, required: true, min: 0 }, // e.g. fixed or calculated %
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  images: [{ type: String, required: true }],
  specifications: {
    operatingWeight: { type: String, default: '' },
    enginePower: { type: String, default: '' },
    bucketCapacity: { type: String, default: '' },
    fuelType: { type: String, default: 'Diesel' },
    maxReach: { type: String, default: '' }
  },
  approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', index: true },
  rejectionReason: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
```

### `Booking.js` (`src/modules/bookings/booking.model.js`)

```javascript
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true }, // e.g. BK-90812
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true, index: true },
  totalDays: { type: Number, required: true },
  dailyRate: { type: Number, required: true },
  rentTotal: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'Pending Deposit',
      'Pending Owner Approval',
      'Approved',
      'Rental Active',
      'Completed',
      'Cancelled'
    ],
    default: 'Pending Deposit',
    index: true
  },
  depositStatus: {
    type: String,
    enum: ['Pending Deposit', 'Deposit Paid', 'Held in Escrow', 'Deposit Refunded', 'Forfeited'],
    default: 'Pending Deposit'
  },
  paymentMethod: { type: String, default: 'Card' },
  stripePaymentIntentId: { type: String, default: null },
  timeline: [{
    step: { type: String, required: true },
    date: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
```

---

## 3. Core Business Logic Algorithms & Implementation Code

### A. Date Overlap Availability Search Engine

This service algorithm ensures that equipment double-booking is impossible.

```javascript
// src/modules/equipment/equipment.service.js
const Booking = require('../bookings/booking.model');
const Equipment = require('./equipment.model');

/**
 * Searches equipment available between startDate and endDate
 */
async function searchAvailableEquipment({ category, city, minPrice, maxPrice, startDate, endDate }) {
  const query = { approvalStatus: 'Approved', isAvailable: true };

  if (category) query.category = category;
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
  }

  // If date filters provided, find overlapping booked equipment IDs
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const bookedEquipment = await Booking.find({
      status: { $in: ['Pending Owner Approval', 'Approved', 'Rental Active'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    }).distinct('equipmentId');

    // Exclude equipment with active overlapping bookings
    query._id = { $nin: bookedEquipment };
  }

  return await Equipment.find(query).populate('category').populate('businessId');
}

module.exports = { searchAvailableEquipment };
```

---

### B. Booking Financial Breakdown Calculator

```javascript
// src/modules/bookings/booking.service.js
function calculateBookingBreakdown(pricePerDay, depositAmount, startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  const timeDiff = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;

  const rentTotal = pricePerDay * totalDays;
  const platformFee = Math.round(rentTotal * 0.05); // 5% platform fee
  const grandTotal = rentTotal + depositAmount + platformFee;

  return {
    totalDays,
    dailyRate: pricePerDay,
    rentTotal,
    depositAmount,
    platformFee,
    grandTotal
  };
}
```

---

### C. Payment Gateway & Escrow Webhook Handler

```javascript
// src/modules/escrow/escrow.controller.js
const stripe = require('../../config/stripe');
const Booking = require('../bookings/booking.model');
const { notifyUser } = require('../notifications/socket');

async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.bookingId;

    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.status = 'Pending Owner Approval';
      booking.depositStatus = 'Held in Escrow';
      booking.stripePaymentIntentId = paymentIntent.id;
      booking.timeline[0].completed = true; // Deposit Paid
      booking.timeline[1].completed = true; // Sent to Owner
      await booking.save();

      // Send real-time Socket.IO notification to Equipment Owner
      notifyUser(booking.ownerId.toString(), 'NEW_BOOKING_REQUEST', {
        title: 'New Booking Request',
        message: `New booking request for #${booking.bookingNumber}`,
        bookingId: booking._id
      });
    }
  }

  res.json({ received: true });
}
```

---

### D. Multi-File Cloud Storage Middleware

```javascript
// src/middleware/uploadMiddleware.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

async function uploadToCloudinary(fileBuffer, folder = 'rentra') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

module.exports = { upload, uploadToCloudinary };
```

---

### E. Socket.IO Real-Time Notification Server

```javascript
// src/modules/notifications/socket.js
let ioInstance = null;
const userSocketsMap = new Map(); // userId -> socketId

function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    socket.on('register_user', (userId) => {
      userSocketsMap.set(userId, socket.id);
      socket.userId = userId;
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        userSocketsMap.delete(socket.userId);
      }
    });
  });
}

function notifyUser(userId, event, payload) {
  if (!ioInstance) return;
  const socketId = userSocketsMap.get(userId);
  if (socketId) {
    ioInstance.to(socketId).emit(event, payload);
  }
}

module.exports = { initSocket, notifyUser };
```

---

### F. Admin Analytics Aggregation Pipelines

```javascript
// src/modules/admin/admin.service.js
const User = require('../users/user.model');
const Business = require('../businesses/business.model');
const Equipment = require('../equipment/equipment.model');
const Booking = require('../bookings/booking.model');

async function getDashboardStats() {
  const [totalUsers, totalBusinesses, totalEquipment, totalBookings, pendingVerifications, pendingEquipmentApprovals] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    Business.countDocuments({ kycStatus: 'Approved' }),
    Equipment.countDocuments({ approvalStatus: 'Approved' }),
    Booking.countDocuments(),
    Business.countDocuments({ kycStatus: 'Pending' }),
    Equipment.countDocuments({ approvalStatus: 'Pending' })
  ]);

  // Aggregate monthly platform revenue
  const revenueResult = await Booking.aggregate([
    { $match: { status: { $in: ['Rental Active', 'Completed'] } } },
    { $group: { _id: null, totalRevenue: { $sum: '$platformFee' } } }
  ]);

  const totalRevenue = revenueResult[0] ? revenueResult[0].totalRevenue : 0;

  return {
    totalUsers,
    totalBusinesses,
    totalEquipment,
    totalBookings,
    pendingVerifications,
    pendingEquipmentApprovals,
    monthlyRevenue: `$${totalRevenue.toLocaleString()}`
  };
}

module.exports = { getDashboardStats };
```

---

## 4. Granular Step-by-Step Build Instructions for Team of 4

### Member 1: Core Architecture, Auth, Security & User Governance

**Scope**: Server setup, database connectivity, authentication system, user profiles, admin user access control, security middleware.

#### 📝 Step-by-Step Coding Checklist:

1. **Initialize Project Foundation**:

   - Create `server/package.json` with scripts (`"start": "node index.js"`, `"dev": "nodemon index.js"`).
   - Install dependencies: `express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`, `jsonwebtoken`, `bcryptjs`, `ioredis`.
   - Write `src/config/db.js` for MongoDB connection string management.
   - Write `src/app.js` with `cors()`, `helmet()`, `express.json()`, and global error handler.
2. **Implement User & Auth Module**:

   - Write `src/modules/users/user.model.js` with fields (`name`, `email`, `passwordHash`, `role`, `status`).
   - Write `src/modules/auth/auth.service.js`:
     - `registerUser({ name, email, password, role, phone })`: Hash password using `bcryptjs` with salt rounds 10.
     - `loginUser({ email, password })`: Validate email, compare bcrypt password, issue Access Token (15m) and Refresh Token (7d).
   - Write `src/middleware/authMiddleware.js`: Verify JWT header `Bearer <token>`, check user status in MongoDB, attach `req.user`.
   - Write `src/middleware/rbacMiddleware.js`: Higher-order function `authorize(...roles)` that checks `req.user.role`.
3. **Implement User & Admin User Controllers**:

   - Write `src/modules/users/user.controller.js`:
     - `getProfile`: Return `req.user`.
     - `updateProfile`: Update name, phone, address, avatar URL.
   - Write `src/modules/admin/admin.controller.js` (User portion):
     - `getAllUsers`: Paginated user list with role filter.
     - `toggleUserStatus`: Block/Unblock user and invalidate active tokens in Redis.
4. **Testing Checklist**:

   - Test `POST /api/v1/auth/register` with Postman.
   - Test `POST /api/v1/auth/login` to confirm JWT token response.
   - Verify protected routes reject requests without valid Bearer tokens.

---

### Member 2: Equipment Catalog, Media Storage & Search Engine

**Scope**: Categories, equipment listings, Cloudinary upload integration, search engine with date availability, wishlist APIs.

#### 📝 Step-by-Step Coding Checklist:

1. **Implement Category Module**:

   - Write `src/modules/categories/category.model.js` (`name`, `slug`, `icon`, `description`).
   - Write CRUD controllers for Admin in `src/modules/categories/category.controller.js`.
   - Write public route `GET /api/v1/categories`.
2. **Implement Image Storage & Equipment Models**:

   - Configure `src/config/cloudinary.js`.
   - Create `src/middleware/uploadMiddleware.js` using `multer.memoryStorage()` and Cloudinary stream pipe.
   - Write `src/modules/equipment/equipment.model.js` with specs, price per day, deposit amount, location, approval status.
3. **Implement Equipment CRUD & Search Logic**:

   - Write `src/modules/equipment/equipment.service.js`:
     - `createEquipment`: Set `approvalStatus = 'Pending'`, associate `ownerId` and `businessId`.
     - `updateEquipment`: Allow owner to edit specs, price, images, availability.
     - `searchAvailableEquipment`: Implement date-overlap check querying `Booking` model to exclude busy machinery.
   - Write `src/modules/equipment/equipment.controller.js`:
     - `search`: Endpoint `GET /api/v1/equipment/search`.
     - `getById`: Endpoint `GET /api/v1/equipment/:id`.
4. **Implement Wishlist Module**:

   - Write `src/modules/wishlist/wishlist.model.js` (`userId`, `equipmentIds[]`).
   - Write `src/modules/wishlist/wishlist.controller.js` to toggle wishlist items and populate saved equipment cards.

---

### Member 3: Booking State Machine, Payment Gateway & Escrow Engine

**Scope**: Booking request preparation, financial calculations, Stripe/Razorpay payment gateway, escrow deposit lifecycle, owner earnings payouts.

#### 📝 Step-by-Step Coding Checklist:

1. **Implement Booking Model & Calculation Service**:

   - Write `src/modules/bookings/booking.model.js` with status state machine (`Pending Deposit` ➔ `Pending Owner Approval` ➔ `Approved` ➔ `Rental Active` ➔ `Completed` ➔ `Cancelled`).
   - Write `src/modules/bookings/booking.service.js`:
     - `prepareBooking({ equipmentId, startDate, endDate })`: Calculate total days, rent total, 5% platform fee, grand total, and return draft receipt.
2. **Implement Escrow & Payment Gateway Integration**:

   - Configure `src/config/stripe.js`.
   - Write `src/modules/escrow/escrow.service.js`:
     - `createDepositPaymentIntent(bookingId)`: Generate Stripe PaymentIntent with metadata `{ bookingId }`.
     - `refundDeposit(bookingId)`: Call Stripe Refund API if booking is cancelled or rejected.
   - Write Stripe Webhook controller in `src/modules/escrow/escrow.controller.js` to handle `payment_intent.succeeded`.
3. **Implement Owner Action & Rental Lifecycle**:

   - Write `src/modules/bookings/booking.controller.js`:
     - `handleOwnerAction`: Accept or Reject incoming booking requests.
     - `payRemainingBalance`: Transition status from `Approved` to `Rental Active`.
     - `completeRental`: Mark item returned and queue owner earnings payout.
4. **Implement Owner Earnings & Payout Module**:

   - Write `src/modules/payouts/payout.model.js`.
   - Write `src/modules/payouts/payout.controller.js` for fetching earnings balance and executing withdraw transfers.

---

### Member 4: Business KYC, Admin Moderation, Socket.IO & Analytics

**Scope**: Owner business verification, admin content moderation dashboard, real-time WebSocket notifications, platform analytics aggregation.

#### 📝 Step-by-Step Coding Checklist:

1. **Implement Business KYC Module**:

   - Write `src/modules/businesses/business.model.js` (`businessName`, `gstNumber`, `kycStatus`, `kycDocuments[]`).
   - Write `src/modules/businesses/business.controller.js`:
     - `registerBusiness`: Handle PDF/Document upload and store record with `kycStatus = 'Pending'`.
     - `getMyBusinessStatus`: Fetch verification status for owner portal.
2. **Implement Admin Verification & Moderation Controllers**:

   - Write admin verification endpoints in `src/modules/admin/admin.controller.js`:
     - `verifyBusiness`: Approve or Reject owner business registration with optional rejection reason.
     - `moderateEquipment`: Approve or Reject new equipment listings before public search visibility.
3. **Implement Socket.IO Real-Time Engine**:

   - Write `src/modules/notifications/socket.js` to manage active client connections.
   - Write `src/modules/notifications/notification.service.js`:
     - `sendNotification({ userId, title, message, type, link })`: Save notification in MongoDB AND emit real-time event over Socket.IO socket.
4. **Implement Admin Analytics Aggregation**:

   - Write `src/modules/admin/admin.service.js` with MongoDB aggregation pipelines:
     - Compute total revenue, total users, total businesses, pending KYC counts, and active rental stats.

---

## 5. Complete API Endpoints Specification

### Authentication & Users

- `POST /api/v1/auth/register` — Public user signup (`customer` / `owner`).
- `POST /api/v1/auth/login` — Authenticate and receive JWT tokens.
- `GET /api/v1/users/profile` — Get logged-in user details.
- `PUT /api/v1/users/profile` — Update profile info & avatar image.

### Businesses & KYC (Owner / Admin)

- `POST /api/v1/businesses/register` — Owner business registration & document upload.
- `GET /api/v1/businesses/my-status` — Fetch owner KYC status.
- `GET /api/v1/admin/businesses` — Admin list pending business verifications.
- `PATCH /api/v1/admin/businesses/:id/verify` — Admin approve/reject business KYC.

### Equipment & Categories

- `GET /api/v1/categories` — Fetch all machinery categories.
- `POST /api/v1/admin/categories` — Admin create category.
- `GET /api/v1/equipment/search` — Search machinery with filters & date availability.
- `GET /api/v1/equipment/:id` — Get equipment details & calendar.
- `POST /api/v1/equipment` — Owner upload & list new equipment.
- `PUT /api/v1/equipment/:id` — Owner update equipment details.
- `GET /api/v1/equipment/owner` — Owner view listed equipment inventory.
- `PATCH /api/v1/admin/equipment/:id/moderate` — Admin approve/reject equipment listing.

### Bookings, Payments & Escrow

- `POST /api/v1/bookings/prepare` — Calculate booking price breakdown.
- `POST /api/v1/bookings/pay-deposit` — Process escrow deposit payment intent.
- `GET /api/v1/bookings/customer` — Customer view booking history.
- `GET /api/v1/bookings/owner` — Owner view rental requests.
- `PATCH /api/v1/bookings/:id/owner-action` — Owner approve/reject booking request.
- `POST /api/v1/bookings/:id/pay-remaining` — Customer pay remaining balance.
- `POST /api/v1/bookings/:id/cancel` — Cancel booking and trigger deposit refund.

### Wishlist, Notifications & Analytics

- `POST /api/v1/wishlist/toggle` — Toggle saved equipment item.
- `GET /api/v1/wishlist` — Fetch customer wishlist.
- `GET /api/v1/notifications` — Fetch user notification feed.
- `PATCH /api/v1/notifications/:id/read` — Mark notification read.
- `GET /api/v1/admin/dashboard-stats` — Admin metrics & financial analytics.

---

## 6. Production Deployment & Database Seeding Blueprint

### Database Seeder (`src/utils/seedData.js`)

Create a seed script that inserts default initial data for testing:

1. **Admin User**: `admin@rentra.com` / `AdminPass123!`.
2. **Owner User & Approved Business**: `owner@rentra.com` / `owner123` with verified business `Titan Heavy Rentals Inc.`.
3. **Customer User**: `customer@rentra.com` / `customer123`.
4. **Initial Categories**: Construction, Agriculture, Earthmoving, Energy Systems, Hauling & Logistics.
5. **Initial Approved Equipment**: Hydraulic Excavators, Boom Lifts, Tractors with high quality image URLs.

Run seeder command:

```bash
node src/utils/seedData.js
```

### Production Deployment Setup

- **App Hosting**: Render / Railway / AWS EC2 with Node.js v20.
- **Database**: MongoDB Atlas Cluster with replica sets enabled.
- **Cache**: Redis Cloud / Upstash Redis instance.
- **Process Manager**: PM2 cluster mode (`pm2 start index.js -i max`).
- **Environment**: Ensure `NODE_ENV=production` and set secure CORS origin `https://rentra.com`.
