# Rentra Core Platform

**Rentra** is an enterprise-grade, B2B/B2C marketplace platform designed for the high-value asset rental industry. The platform bridges the gap between equipment owners and customers through a secure, scalable, and heavily moderated environment. 

Developed on the MERN stack, Rentra focuses on transactional integrity, utilizing an escrow-based payment system, rigorous KYC validation workflows, and real-time state synchronization to manage complex booking lifecycles.

---

## 🏗️ Architecture Overview

The system is built on a monolithic Node.js/Express backend servicing a decoupled React Single Page Application (SPA). To manage the complexity of a 3-sided marketplace (Customer, Owner, Admin), the architecture enforces strict boundaries across data access, state management, and API routing.

### 1. Security & Role-Based Access Control (RBAC)
- **Authentication:** Stateless authentication utilizing JSON Web Tokens (JWT) stored securely. Integrated Google OAuth 2.0 (Passport.js) as a secondary authentication provider.
- **Authorization:** Custom middleware intercepts all API requests to enforce role hierarchy (`CUSTOMER`, `OWNER`, `ADMIN`). Owners inherit Customer privileges, ensuring DRY route definitions.
- **Data Integrity:** Mongoose schemas enforce strict data typing, pre-save hooks for `bcrypt` password hashing, and data sanitization to prevent NoSQL injection.

### 2. Transactional Integrity & Escrow
- **Payment Routing:** Integrated with Razorpay's API. Customers pay a mandatory 20% advance deposit which is held in escrow. This locks the booking state and mitigates no-show risks.
- **State Machine:** Booking entities do not use simple boolean flags. They are managed by a strict 9-stage state machine (`PENDING_APPROVAL`, `AWAITING_PAYMENT`, `DISPATCHED`, `ACTIVE`, `COMPLETED`, `DISPUTED`, etc.) preventing race conditions and invalid state transitions during the rental lifecycle.

### 3. Asynchronous Processing & Real-Time Sync
- **Message Broker:** CPU-heavy tasks and third-party API calls (e.g., Cloudinary media uploads, automated email dispatch) are offloaded to a **Redis-backed BullMQ** task queue to ensure the main Express event loop remains unblocked.
- **WebSocket Layer:** Bidirectional real-time communication powered by **Socket.IO**. Owners receive instant push notifications for incoming requests, state changes, and admin verifications without client-side polling.

---

## 🚀 Infrastructure & Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend SPA** | React.js (Vite), Tailwind CSS, Framer Motion, Context API |
| **Backend API** | Node.js, Express.js (RESTful architecture) |
| **Database** | MongoDB (Atlas), Mongoose ORM |
| **Cache & Queues**| Redis, BullMQ |
| **3rd Party Integrations**| Razorpay (Payments), Cloudinary (CDN), Google OAuth |

---

## 📂 Repository Structure

```text
rentra-platform/
├── client/                 # React SPA (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Isolated Global State (Auth, Customer, Owner, Admin)
│   │   ├── pages/          # Role-specific route views
│   │   └── services/       # Axios API client modules
├── server/                 # Node.js REST API
│   ├── src/
│   │   ├── controllers/    # Request handling & business logic
│   │   ├── middleware/     # JWT validation, RBAC, Error handling
│   │   ├── models/         # Mongoose Schemas & Validation
│   │   └── routes/         # Express route definitions
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Environment Configuration
Ensure you have Node.js (v18+) and Redis running locally. Create a `.env` file in the `/server` directory with the following required variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_cluster_uri
JWT_SECRET=your_secure_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_URL=your_cloudinary_url
REDIS_URL=redis://127.0.0.1:6379
```

### 2. Initialization
```bash
# Terminal 1: Initialize Backend
cd server
npm install
npm run dev

# Terminal 2: Initialize Frontend
cd client
npm install
npm run dev
```

---

## 👥 Engineering Team

The platform was architected and developed collaboratively by:

- **Purvesh Jadhav (Full-Stack Developer & Architect):** Engineered the core system architecture, database relationships, and MVC backend structure. Developed the comprehensive Node.js/Express REST API, MongoDB schemas, and integrated the Razorpay escrow deposit system. Architected the global React Context state management separating the logic for all three user portals.
- **Aryan Barbate (Backend Developer):** Assisted with backend API routing and JWT authentication flows. Handled Multer/Cloudinary media upload pipelines and integrated Redis/BullMQ for background task processing.
- **Pruthviraj Bhosale (Frontend Developer):** Developed the Customer Module UI, implementing the equipment search interface, filtering logic, rental checkout flows, and customer dashboard.
- **Aryan Kulkarni (Frontend Developer):** Developed the Owner Module UI, including complex business KYC registration forms, dynamic asset listings, and owner booking management interfaces.
- **Ayush Bhor (Frontend Developer):** Developed the Admin Module UI, focusing on high-level platform analytics, manual user/equipment verification workflows, and global oversight dashboards.
