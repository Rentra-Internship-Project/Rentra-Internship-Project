# Rentra Core Platform 🏗️

**Rentra** is a sophisticated, highly scalable B2B/B2C marketplace platform explicitly engineered to disrupt the high-value asset rental sector. We provide a secure digital infrastructure for renting heavy machinery, production gear, event logistics, and specialized industrial equipment.

Unlike standard peer-to-peer marketplaces, Rentra is built around absolute **transactional security and trust**. By enforcing rigorous KYC verification algorithms, managing a robust 20% upfront escrow routing system, and utilizing bidirectional real-time state synchronization, Rentra solves the hardest problems in high-value asset management: fraud prevention, double-booking, and payment security.

---

## 🏛️ Advanced System Architecture

The platform is designed around a decoupled monolith pattern, separating the high-performance Node.js REST API from the React Client. It manages the extreme complexity of three entirely separate user ecosystems (Customer, Owner, Admin) through strict role-based access boundaries.

### 1. Robust Security & Role-Based Access Control (RBAC)
- **Zero-Trust Auth Strategy:** Rentra utilizes stateless JSON Web Tokens (JWT) signed with highly secure environment variables. For frictionless onboarding, we integrated **Google OAuth 2.0 via Passport.js**.
- **Role Inheritance Routing:** Custom Express middleware intercepts all API traffic to enforce strict access control (`CUSTOMER`, `OWNER`, `ADMIN`). The system employs a permission inheritance tree (e.g., an `OWNER` inherits all `CUSTOMER` abilities natively), enforcing DRY routing principles.
- **Sanitization Pipeline:** Our MongoDB models are heavily typed. We utilize Mongoose pre-save hooks to enforce strict `bcrypt` password hashing and actively sanitize payloads to prevent NoSQL injection attacks.

### 2. Transactional Integrity & The Escrow State Machine
- **Razorpay Escrow Integration:** High-value rentals cannot rely on trust. Customers are required to pay a mandatory 20% advance deposit via Razorpay. This capital is securely routed to an escrow state, programmatically locking the booking and mitigating the risk of costly no-shows.
- **9-Stage Immutable Booking Lifecycle:** Bookings are managed by a highly strict state machine designed to prevent race conditions. The state flows sequentially: `PENDING_APPROVAL` ➡️ `AWAITING_PAYMENT` ➡️ `PAYMENT_SECURED` ➡️ `DISPATCHED` ➡️ `ACTIVE_RENTAL` ➡️ `COMPLETED` (or `DISPUTED`). It is impossible for a booking to bypass a logical step.

### 3. Asynchronous Task Queues & Real-Time Sync
- **Redis & BullMQ Architecture:** To ensure the core Node.js event loop remains blazing fast and unblocked, all CPU-heavy tasks are offloaded to Redis. Generating PDF invoices, compressing/uploading media to Cloudinary, and dispatching transactional emails are processed asynchronously by background BullMQ workers.
- **Socket.IO Bidirectional Engine:** The platform abandons slow client-side HTTP polling in favor of a true WebSocket layer. Equipment owners receive instant, real-time push notifications the exact millisecond a customer requests their asset or an Admin approves their business KYC.

---

## 🚀 Infrastructure & Tech Stack

| Domain | Core Technologies |
|-------|-------------|
| **Frontend SPA** | React.js (Vite), Tailwind CSS, Framer Motion, React Context API |
| **Backend API** | Node.js, Express.js (RESTful Architecture) |
| **Database** | MongoDB (Atlas Cloud), Mongoose ORM |
| **Cache & Queues**| Redis (In-Memory Data Store), BullMQ |
| **3rd Party APIs**| Razorpay (Financial Routing), Cloudinary (CDN), Google OAuth 2.0 |

---

## 📂 Repository Structure Map

```text
rentra-platform/
├── client/                 # React SPA (Vite)
│   ├── src/
│   │   ├── components/     # Reusable, atomic UI components (Buttons, Modals, Cards)
│   │   ├── context/        # Isolated Global State (Auth, Customer, Owner, Admin)
│   │   ├── pages/          # Role-specific route views (Separated by User Type)
│   │   └── services/       # Axios API client modules for backend communication
├── server/                 # Node.js REST API
│   ├── src/
│   │   ├── controllers/    # Request handling, data parsing, and business logic
│   │   ├── middleware/     # JWT validation, RBAC enforcement, Error catching
│   │   ├── models/         # Mongoose Schemas, validation hooks, and relationships
│   │   └── routes/         # Express endpoint definitions mapped to controllers
└── README.md
```

---

## ⚙️ Local Development & Deployment Setup

### 1. Environment Variable Configuration
Ensure you have Node.js (v18+) and Redis running locally. Create a `.env` file in the `/server` directory with the following secure variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_cluster_uri
JWT_SECRET=your_secure_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_URL=your_cloudinary_url
REDIS_URL=redis://127.0.0.1:6379
```

### 2. Initialization Workflow
Open two terminal instances to boot the monolithic architecture:
```bash
# Terminal 1: Initialize the Backend Server
cd server
npm install
npm run dev

# Terminal 2: Initialize the Frontend Client
cd client
npm install
npm run dev
```

---

## 👥 Engineering Team

The platform was architected and developed collaboratively by:

- **Purvesh Jadhav (Full-Stack Developer & Architect):** Engineered the core system architecture, database relationships, and MVC backend structure. Developed the comprehensive Node.js/Express REST API, MongoDB schemas, and integrated the Razorpay escrow deposit system. Architected the global React Context state management separating the logic for all three user portals.
- **Aryan Barbate (Backend Developer):** Assisted with backend API routing and JWT authentication flows. Implemented **Socket.IO for real-time notifications**, handled Multer/Cloudinary media upload pipelines, and integrated Redis/BullMQ for asynchronous background task processing.
- **Pruthviraj Bhosale (Frontend Developer):** Developed the Customer Module UI, implementing the equipment search interface, complex filtering algorithms, secure rental checkout flows, and the interactive customer dashboard.
- **Aryan Kulkarni (Frontend Developer):** Developed the Owner Module UI, engineering the complex business KYC registration forms, dynamic asset listing interfaces, and the owner-side booking management hub.
- **Ayush Bhor (Frontend Developer):** Developed the Admin Module UI, focusing on high-level platform analytics, manual user/equipment verification workflow interfaces, and global oversight dashboards.

---
> *Rentra Internship Project - 2026*
