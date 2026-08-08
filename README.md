# RENTRA

AI-Powered B2B Equipment Rental Platform

## Project Overview

RENTRA is a full-stack B2B equipment rental marketplace that connects equipment owners with customers needing heavy machinery for construction, industrial, agricultural, and infrastructure projects. The platform streamlines the rental lifecycle — from equipment discovery and booking to payment, rental management, and deposit refunds.

**Who uses it:**

- **Customers** — Construction firms, contractors, and project managers who browse, book, and manage equipment rentals
- **Owners** — Equipment rental businesses that list machinery, manage bookings, and track earnings
- **Administrators** — Platform operators who verify businesses, approve equipment listings, and oversee marketplace activity

## Key Features

### Customer Module
- **Dashboard** — Overview of active rentals, upcoming bookings, wishlist count, and total spend
- **Browse Equipment** — Filterable catalog with category, location, and availability filters
- **Equipment Details** — Full specifications, image gallery, owner details, reviews, and booking initiation
- **Booking Flow** — Multi-step: Booking Summary → Deposit Payment → Payment Success
- **Wishlist** — Save equipment for future consideration
- **Booking History** — Complete timeline with status tracking (Pending → Approved → Active → Completed)
- **Booking Details** — Full rental breakdown, payment schedule, site address, and timeline
- **Profile** — Personal info, company details, security settings, and activity log
- **Notifications** — Real-time alerts for payments, approvals, reminders, and refunds
- **Demo Login** — Pre-filled credentials for immediate access

### Owner Module
- **Dashboard** — Stats cards (equipment, active bookings, pending requests, earnings), recent activity, and notifications
- **Business Registration** — Multi-step form for company details, documents, and verification submission
- **Business Status** — Verification timeline with document status and admin remarks
- **Equipment Management** — List all equipment with status badges (Approved, Pending, Rejected)
- **Add/Edit Equipment** — Forms with specifications, pricing, images, and category selection
- **Booking Requests** — Incoming requests with Accept/Reject actions and customer details
- **Earnings** — Revenue charts, monthly breakdown, transaction history, and pending payouts
- **Profile** — Owner info, business details, and recent activity feed
- **Protected Routes** — Owner-only access via authentication guard

### Admin Module
- **Dashboard** — Platform metrics (users, businesses, equipment, bookings, revenue), quick actions, and recent activity feed
- **Users Management** — Data table with role, status, and block/unblock actions
- **Business Verification** — Review submissions, verify documents, approve/reject with remarks
- **Equipment Approval** — Moderate owner-submitted listings with specification review
- **Categories Management** — CRUD for equipment categories with counts and icons
- **Bookings Overview** — Platform-wide booking monitoring with status filters
- **Profile** — Admin details, platform stats, and action history

## Technology Stack

### Frontend
| Technology | Version |
|------------|---------|
| React | 19.2.8 |
| Vite | 8.2.0 |
| React Router DOM | 7.18.2 |
| Tailwind CSS | 4.3.3 |
| Framer Motion | 12.43.0 |
| React Icons | 5.7.0 |

### Backend
| Technology | Version |
|------------|---------|
| Express | 5.2.1 |
| Mongoose | 9.8.1 |
| Nodemon | 3.1.14 |

### Development Tools
- ESLint (via Vite React plugin)
- PostCSS (via Tailwind CSS v4)

## Project Structure

```
RENTRA/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminNavbar.jsx
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   ├── RecentActivity.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   └── StatusBadge.jsx
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── ConfirmModal.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── customer/
│   │   │   │   ├── BookingCard.jsx
│   │   │   │   ├── CustomerNavbar.jsx
│   │   │   │   ├── CustomerSidebar.jsx
│   │   │   │   ├── EquipmentCard.jsx
│   │   │   │   ├── NotificationCard.jsx
│   │   │   │   ├── ProfileCard.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   └── WishlistCard.jsx
│   │   │   └── owner/
│   │   │       ├── BookingCard.jsx
│   │   │       ├── BusinessCard.jsx
│   │   │       ├── EarningsCard.jsx
│   │   │       ├── EquipmentCard.jsx
│   │   │       ├── OwnerNavbar.jsx
│   │   │       ├── OwnerSidebar.jsx
│   │   │       ├── ProfileCard.jsx
│   │   │       ├── StatsCard.jsx
│   │   │       └── StatusCard.jsx
│   │   ├── context/
│   │   │   ├── AdminContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   └── CustomerContext.jsx
│   │   ├── data/
│   │   │   ├── adminMockData.js
│   │   │   ├── customerMockData.js
│   │   │   └── ownerMockData.js
│   │   ├── hooks/
│   │   │   └── useAdminData.js
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── CustomerLayout.jsx
│   │   │   └── OwnerLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Bookings.jsx
│   │   │   │   ├── Businesses.jsx
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Equipment.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── Users.jsx
│   │   │   ├── customer/
│   │   │   │   ├── BookingDetails.jsx
│   │   │   │   ├── Bookings.jsx
│   │   │   │   ├── BrowseEquipment.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── DepositPayment.jsx
│   │   │   │   ├── EquipmentDetails.jsx
│   │   │   │   ├── Notifications.jsx
│   │   │   │   ├── PaymentSuccess.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── BookingSummary.jsx
│   │   │   │   └── Wishlist.jsx
│   │   │   ├── owner/
│   │   │   │   ├── AddEquipment.jsx
│   │   │   │   ├── Bookings.jsx
│   │   │   │   ├── BusinessStatus.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── EditEquipment.jsx
│   │   │   │   ├── Earnings.jsx
│   │   │   │   ├── Equipment.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── RegisterBusiness.jsx
│   │   │   └── public/
│   │   │       ├── Home.jsx
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   │   ├── routes/
│   │   │   ├── AdminRoutes.jsx
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── CustomerRoutes.jsx
│   │   │   ├── OwnerRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── adminService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── server/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

## Application Modules

### Customer Module
The customer-facing interface for discovering and renting equipment. Users can browse a catalog of verified machinery, view detailed specifications and reviews, initiate bookings through a guided payment flow (deposit → confirmation), track rental status via an interactive timeline, manage a personal wishlist, and receive real-time notifications for payment confirmations, approvals, and refunds.

### Owner Module
The business portal for equipment rental companies. Owners register their business with document verification, list equipment with detailed specifications and pricing, manage incoming booking requests (accept/reject), monitor earnings with visual charts and transaction history, and track verification status through a transparent admin review timeline. All owner routes are protected by an authentication guard.

### Admin Module
The platform control center for marketplace operators. Administrators oversee platform health via key metrics, verify business applications with document review, moderate equipment listings before publication, manage equipment categories, monitor all platform bookings, and manage user accounts (including blocking). An activity feed and quick-action panel provide real-time operational visibility.

## Routing

### Public Routes
| Route | Page |
|-------|------|
| `/` | Home (Landing) |
| `/login` | Login (Demo Entry) |
| `/register` | Registration |

### Customer Routes (`/customer/*`)
| Route | Page |
|-------|------|
| `/dashboard` | Customer Dashboard |
| `/browse-equipment` | Equipment Catalog |
| `/equipment/:id` | Equipment Details |
| `/booking-summary/:id` | Booking Summary |
| `/payment/:id` | Deposit Payment |
| `/payment-success` | Payment Success |
| `/wishlist` | Saved Equipment |
| `/bookings` | Booking History |
| `/bookings/:id` | Booking Details |
| `/profile` | Customer Profile |
| `/notifications` | Notifications Center |

### Owner Routes (`/owner/*`) — Protected
| Route | Page |
|-------|------|
| `/dashboard` | Owner Dashboard |
| `/register-business` | Business Registration |
| `/business-status` | Verification Status |
| `/equipment` | Equipment Management |
| `/add-equipment` | Add New Equipment |
| `/edit-equipment/:id` | Edit Equipment |
| `/bookings` | Booking Requests |
| `/earnings` | Earnings & Payouts |
| `/profile` | Owner Profile |

### Admin Routes (`/admin/*`)
| Route | Page |
|-------|------|
| `/dashboard` | Admin Dashboard |
| `/users` | User Management |
| `/businesses` | Business Verification |
| `/equipment` | Equipment Approval |
| `/categories` | Category Management |
| `/bookings` | Platform Bookings |
| `/profile` | Admin Profile |

## Demo Login

The login page (`/login`) serves as the **demo entry point** for the application. It uses hardcoded credentials stored in `AuthContext.jsx`:

- **Email:** `customer@rentra.com`
- **Password:** `customer123`

> **Important:** This is a demonstration authentication flow only. There is **no real authentication implementation** — no JWT, OAuth, session management, password hashing, or backend verification. The `ProtectedRoute` guard checks only a client-side boolean flag. Do not use this pattern in production.

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd Rentra-Internship-Project

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

## Running the Project

### Development Mode

**Terminal 1 — Client (Vite Dev Server)**
```bash
cd client
npm run dev
```
Runs at `http://localhost:5173` (default Vite port)

**Terminal 2 — Server (Express + Nodemon)**
```bash
cd server
npm start
```
Runs at `http://localhost:3000`

> The server currently only serves a basic "Hello, World!" endpoint. No API routes or database connections are implemented. The frontend operates entirely on mock data.

### Production Build
```bash
cd client
npm run build
```
Outputs to `client/dist/`

## Environment Variables

No environment variables are currently required. The project runs entirely on client-side mock data with no backend API integration.

If a database connection is added later, the following would be needed in a `.env` file in the `server/` directory:
```
MONGO_URI=
PORT=3000
```

## UI / Design

- **Design System:** Professional SaaS dashboard aesthetic
- **Primary Brand Color:** Purple (`#CCCCFF` / `#5D5DEB`) with dark slate (`#0F172A`) text
- **Layout:** Responsive, mobile-first with collapsible sidebars on all three modules
- **Animations:** Framer Motion for page transitions, hover effects, and micro-interactions
- **Icons:** React Icons (Fi, Fa collections)
- **Components:** Consistent reusable UI kit (Button, Modal, DataTable, Cards, Badges, Loaders, SearchBar)
- **Typography:** System font stack with clear hierarchy

## Current Project Status

RENTRA currently contains **three complete frontend modules** (Customer, Owner, Admin) with their respective dashboards, navigation flows, and feature pages. All data is sourced from local mock data files (`customerMockData.js`, `ownerMockData.js`, `adminMockData.js`). The login page serves as a demonstration entry point with hardcoded credentials. The backend is a minimal Express server with Mongoose installed but no API routes, controllers, or database connection implemented.

**Implemented:**
- ✅ Complete Customer, Owner, and Admin UI with routing
- ✅ Responsive layouts with sidebar navigation
- ✅ Mock data for all modules (profiles, equipment, bookings, earnings, notifications)
- ✅ Booking flow (summary → deposit → success)
- ✅ Business registration and verification UI
- ✅ Equipment CRUD forms (owner) + approval UI (admin)
- ✅ Protected routes for owner module
- ✅ Animations and polished interactions

**Not Implemented:**
- ❌ Real authentication (JWT, sessions, password hashing)
- ❌ Backend API endpoints
- ❌ Database integration (MongoDB)
- ❌ Payment gateway integration
- ❌ Real-time notifications (WebSockets)
- ❌ File upload for documents/images
- ❌ Email/SMS notifications
- ❌ Search/filters backend
- ❌ Role-based access control on backend

## Future Improvements

- Real authentication with JWT/OAuth and secure password storage
- Backend REST API with Express controllers and Mongoose models
- MongoDB integration for persistent data
- Payment gateway (Stripe/Razorpay) for deposits and payouts
- Real-time notifications via WebSockets
- File upload (AWS S3 / Cloudinary) for equipment images and business documents
- Email/SMS transactional notifications
- Advanced search with Elasticsearch or MongoDB Atlas Search
- Role-based access control enforced on backend
- Admin audit logs and analytics dashboard
- Multi-language / i18n support
- Production deployment (Docker, CI/CD, cloud hosting)

## License

This project was developed as an academic/internship project.