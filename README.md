# Rentra - High-Value Asset Rental Marketplace

Rentra is a full-stack, 3-sided marketplace built on the **MERN Stack**. It connects Customers with Equipment Owners, facilitated by a comprehensive Admin dashboard. The platform handles complex workflows including real-time notifications, secure escrow payments, and a 9-stage booking lifecycle.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router DOM, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Payments & Security:** Razorpay API, JWT, Bcrypt, Google Passport.js
- **Real-Time & Background:** Socket.IO, Redis, BullMQ
- **Storage:** Cloudinary (Images)

---

## 🧠 Core Features

1. **Role-Based Portals:** Three completely isolated dashboards (Customer, Owner, Admin) protected by robust JWT middleware.
2. **Escrow Payment System:** Customers pay a 20% deposit via Razorpay to lock the booking. The remaining balance is paid directly to the owner upon pickup.
3. **9-Stage Booking Lifecycle:** A complex state machine handling statuses from `Pending Owner Approval` to `Active Rental` and `Completed`.
4. **Real-Time Notifications:** Socket.IO instantly notifies owners of new booking requests without requiring a page refresh.
5. **Optimized Search:** Real-time frontend filtering for heavy machinery, cameras, and event equipment.

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB locally installed or an Atlas URI
- Razorpay API Keys
- Cloudinary Credentials

### 1. Backend Setup
```bash
cd server
npm install
# Create a .env file based on .env.example
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 👥 Project Team & Contributions

This project was built collaboratively by our team:

- **Purvesh Jadhav (Full-Stack Developer & Architect):** Designed the core system architecture, database relationships, and MVC backend structure. Built the complete Node.js/Express RESTful API, MongoDB data models, and engineered the 20% escrow deposit system using Razorpay. Designed the global React Context state management across all user portals.
- **Aryan Barbate (Backend Developer):** Assisted with core backend routing and JWT authentication. Integrated Redis/BullMQ for asynchronous background tasks and handled Multer/Cloudinary media upload pipelines.
- **Pruthviraj Bhosale (Frontend Developer):** Developed the Customer Module UI, including equipment search, rental flows, and the customer dashboard.
- **Aryan Kulkarni (Frontend Developer):** Developed the Owner Module UI, including business registration, equipment listings, and booking management interfaces.
- **Ayush Bhor (Frontend Developer):** Developed the Admin Module UI, focusing on platform analytics, verifications, and oversight dashboards.

---
> *Rentra Internship Project - 2026*
