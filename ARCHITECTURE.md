# Rentra System Architecture

## Overview
Rentra follows a robust, decoupled **MERN (MongoDB, Express, React, Node.js)** architecture. The system is designed to handle multi-tenant business models (Customers, Equipment Owners, and Administrators) using Role-Based Access Control (RBAC) and a centralized State Machine for rental tracking.

## Core Architectural Patterns

### 1. MVC (Model-View-Controller) Backend Pattern
The Express backend strictly adheres to the MVC architectural pattern to ensure separation of concerns:
- **Routes:** Decoupled routing modules (`auth.routes.js`, `booking.routes.js`) act as the entry point.
- **Controllers:** Business logic is isolated in controllers, ensuring routes only handle HTTP routing.
- **Models:** Mongoose schemas enforce rigid data validation, preventing NoSQL injection.

### 2. Context-Driven React State Management
The frontend avoids "prop-drilling" by utilizing the **React Context API**. 
- `AuthContext`: Manages JWT persistence and global user state.
- `SocketContext`: Maintains a persistent, single-instance WebSocket connection for real-time notifications.

### 3. Escrow-Style Booking State Machine
Equipment rentals are highly volatile. To prevent fraudulent transactions, Rentra uses a State Machine pattern. A booking must flow linearly through validated states:
`Pending Approval` ➔ `Deposit Paid` (Razorpay) ➔ `Ready For Pickup` ➔ `Rental Active` ➔ `Return Requested` ➔ `Completed`.
*Any attempt to bypass a state is rejected by the backend validation layer.*

### 4. Real-Time Event-Driven Notifications
We utilize **Socket.IO** to bridge the HTTP gap. When a state transition occurs (e.g., an Owner approves a booking), the Express controller immediately triggers an event to the `io` instance, pushing a notification directly to the connected client.

## Lead Architect Notes
- Designed for fault-tolerance: If cloud services like Redis fail, the application gracefully degrades to in-memory caching.
- Auth payload minimization: JWTs contain only non-sensitive identifying data (`id`, `role`), minimizing exposure during transit.
