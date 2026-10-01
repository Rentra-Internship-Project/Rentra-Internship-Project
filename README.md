# Rentra: Cross-Platform Equipment Rental Marketplace

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
</div>

Rentra is a full-stack, cross-platform (Web + Mobile) marketplace designed for high-value equipment rentals. Built as a comprehensive internship project, it features a secure escrow deposit system, role-based access control, a synchronized React Native mobile app, and a unique PIN-based handover verification system to ensure secure transactions.

## ?? Key Features

*   **Cross-Platform Synchronization:** A React website and a React Native mobile app (Expo) that mirror the exact same MongoDB database in real-time.
*   **Secure PIN Verification:** Equipment handover is protected by a 4-digit PIN system. The rental only starts when the owner verifies the customer's unique pickup PIN.
*   **Automated Availability Lock:** The instant a customer pays the escrow deposit, the equipment is automatically locked as "Rented" and removed from the search pool across all platforms.
*   **Escrow Deposit System:** Integrated with Razorpay to hold a 20% security deposit before rentals begin.
*   **Real-Time Reviews:** A perfectly synchronized review system where feedback left on the mobile app instantly updates the web dashboard.
*   **Multi-Role Dashboards:** Distinct environments for Customers, Equipment Owners, and System Administrators.

## ?? The Mobile App (React Native)

Located in the entra-mobile/ repository, the mobile app allows customers to manage their rentals on the go.
*   Secure Email/Password Authentication (JWT).
*   Live Dashboard syncing Total Spend and Active Bookings.
*   One-tap "Request Return" functionality for active rentals.

## ?? Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS
*   **Mobile:** React Native (Expo)
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas, Mongoose
*   **Payments:** Razorpay
*   **Authentication:** JWT (JSON Web Tokens)

## ??? Quick Start

### 1. Clone & Setup Backend
\\\ash
git clone https://github.com/Rentra-Internship-Project/Rentra-Internship-Project.git
cd Rentra-Internship-Project/server
npm install
npm run dev
\\\

### 2. Setup Web Frontend
\\\ash
cd ../client
npm install
npm run dev
\\\

### 3. Setup Mobile App
\\\ash
cd ../rentra-mobile
npm install
npx expo start
\\\

## ????? Engineering Team

Developed collaboratively by **Purvesh Jadhav** and **Aryan Barbate** as part of the LinkCode Technologies Pvt. Ltd. Internship Program – 2026.
