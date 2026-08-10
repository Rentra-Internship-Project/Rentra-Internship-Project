# Rentra — MERN + Redis + Socket.IO Enterprise Backend API Server

> **Production MERN Architecture**: Node.js 20+, Express 5, MongoDB (Mongoose 9), Redis 7, Socket.IO 4, JWT with HttpOnly Refresh Cookies, Stripe Connect Multi-Party Escrow, Cloudinary Media Pipeline, and BullMQ.

---

## 🛠️ Technology Stack Breakdown

- **Core**: Node.js v20+ & Express 5 (REST API Server)
- **Database**: MongoDB Atlas with Mongoose 9 ORM & `2dsphere` Geospatial Indexing
- **Caching & Queues**: Redis 7, `@socket.io/redis-adapter`, and BullMQ background workers
- **Real-Time Layer**: Socket.IO 4 with JWT Handshake Authentication
- **Security & Auth**: Dual JWTs (15-min Access Token + 7-day HttpOnly SameSite=Strict Refresh Cookie), bcryptjs, Helmet security headers, and Redis Rate Limiting
- **Payments & Escrow**: Stripe Connect Express & Webhooks API (`payment_intent.succeeded`, deposit hold manual capture)
- **Storage & PDF**: Cloudinary API with Multer storage + PDFKit contract generator

---

## 🏗️ Directory Structure (`server/`)

```
server/
├── data/
│   └── db.json               # Seed database file for zero-cost evaluation mode
├── src/
│   ├── config/
│   │   ├── db.js             # Mongoose connection manager
│   │   ├── redis.js          # Redis ioredis connection pool
│   │   ├── socket.js         # Socket.IO server & Redis adapter
│   │   └── cloudinary.js     # Cloudinary media storage engine
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT Bearer header & cookie verification
│   │   ├── rbac.middleware.js # Role enforcement (ADMIN, OWNER, CUSTOMER)
│   │   ├── rateLimiter.js     # Redis-backed rate limiting
│   │   └── error.middleware.js# Centralized error handler & Mongoose 11000 trap
│   ├── modules/
│   │   ├── auth/             # Login, Register, Refresh Token, Logout
│   │   ├── equipment/        # Catalog, Mongoose 2dsphere $nearSphere search, Owner CRUD
│   │   ├── booking/          # ACID Date overlap check, Overtime Engine, E-Sign Inspection
│   │   ├── payments/         # Stripe Connect escrow, Manual capture deposit holds
│   │   └── admin/            # Platform analytics $facet pipeline, Business KYB approval
│   ├── jobs/
│   │   └── worker.js         # BullMQ queue processor (Emails, PDFKit contracts)
│   └── app.js                # Express app launcher & middleware stack
├── .env.example              # Environment variables template
├── index.js                  # Application entry point (Server port 3000)
└── package.json
```

---

## 🚀 Quick Start Instructions

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in `server/`:
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
