# Rentra - High-Value Asset Rental Marketplace

Rentra is a full-stack, 3-sided marketplace built on the **MERN Stack**. It connects Customers with Equipment Owners, facilitated by a comprehensive Admin dashboard. The platform handles complex workflows including real-time notifications, secure escrow payments, and a 9-stage booking lifecycle.

---

## 👑 Lead Architect & Core Engineering

This project was built collaboratively, but the core system was architected and developed by:

**Purvesh Jadhav (Lead Full-Stack Developer)**
- **System Design:** Engineered the overarching architecture, database relationships, and MVC backend structure.
- **Backend API:** Built the entire Node.js/Express RESTful API and highly secure MongoDB (Mongoose) data models.
- **Security & Auth:** Implemented custom JWT authentication and integrated **Google OAuth 2.0 (Passport.js)**.
- **Payments:** Engineered the 20% escrow deposit system using the **Razorpay Gateway** for secure financial routing.
- **Frontend State:** Designed the global state management using React Context API across three isolated user portals (Admin, Owner, Customer).

### 🤝 Team Contributions
- **Frontend UI Team:** Pruthviraj Bhosale, Ayush Bhor, Aryan Kulkarni (React UI, Tailwind Styling, Responsive Layouts).
- **Backend Contributor:** Aryan Barbate (Redis/BullMQ integration for background tasks, Multer/Cloudinary media uploads).

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
> *Rentra Internship Project - 2026*
