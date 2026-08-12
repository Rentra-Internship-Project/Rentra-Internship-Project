# Rentra Complete Execution & Architecture Flow Guide

A comprehensive, end-to-end technical guide mapping the execution flows, system architecture, data models, state synchronization, and component interactions in the Rentra Heavy Machinery & Equipment Rental Marketplace.

---

## 📋 Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Environment & System Initialization (Basic)](#2-environment--system-initialization-basic)
   - [A. Backend Bootstrapping](#a-backend-bootstrapping)
   - [B. Frontend Bootstrapping & Provider Tree](#b-frontend-bootstrapping--provider-tree)
3. [Authentication & Security Lifecycle (Basic to Intermediate)](#3-authentication--security-lifecycle-basic-to-intermediate)
   - [A. User Registration & Password Hashing](#a-user-registration--password-hashing)
   - [B. JWT Token Generation & Client Storage](#b-jwt-token-generation--client-storage)
   - [C. Axios Interceptors & Bearer Authentication](#c-axios-interceptors--bearer-authentication)
   - [D. Role-Based Access Control (RBAC)](#d-role-based-access-control-rbac)
4. [Core Equipment Management & Payload Sanitization (Intermediate)](#4-core-equipment-management--payload-sanitization-intermediate)
   - [A. Location Address vs. GeoJSON Point Mapping](#a-location-address-vs-geojson-point-mapping)
   - [B. Category Standardization Across Roles](#b-category-standardization-across-roles)
5. [Advanced Workflows & Execution Pipelines](#5-advanced-workflows--execution-pipelines)
   - [A. Cloudinary CDN Image Upload Pipeline (Multer + In-Memory Base64)](#a-cloudinary-cdn-image-upload-pipeline-multer--in-memory-base64)
   - [B. Booking & Escrow Payment Lifecycle (Stripe / Razorpay)](#b-booking--escrow-payment-lifecycle-stripe--razorpay)
   - [C. Real-time Communication (Socket.IO)](#c-real-time-communication-socketio)
   - [D. Owner State & MongoDB Synchronization (`refreshData`)](#d-owner-state--mongodb-synchronization-refreshdata)
   - [E. Admin Live Aggregation, Business Verification & Status Badges](#e-admin-live-aggregation-business-verification--status-badges)
6. [Error Handling & System Resiliency](#6-error-handling--system-resiliency)

---

## 1. System Architecture Overview

Rentra is built as a full-stack MERN (MongoDB, Express, React, Node.js) application with real-time WebSocket capabilities, Cloudinary media processing, and Upstash Redis rate-limiting.

```mermaid
graph TD
    %% Client Layer
    subgraph Frontend ["React 18 + Vite Frontend"]
        Browser(("Web Browser"))
        Pages["UI Pages & Routing"]
        State["React Context API"]
        Axios["Axios HTTP Client"]
        SocketClient["Socket.IO Client"]
    end

    %% API Gateway & Server
    subgraph Backend ["Node.js + Express REST API"]
        Server["Express Server (app.js)"]
        RateLimiter["Upstash Redis Rate Limiter"]
        AuthMiddleware["JWT Middleware"]
        MulterMiddleware["Multer Memory Storage"]
        Controllers["Express Controllers"]
        SocketServer["Socket.IO Server"]
    end

    %% Storage & Infrastructure
    subgraph Data ["Data & Cloud Services"]
        MongoDB[("MongoDB Atlas")]
        Redis[("Upstash Redis")]
        Cloudinary{"Cloudinary CDN"}
        EscrowGateway{"Stripe / Razorpay Escrow"}
    end

    Browser --> Pages
    Pages <--> State
    Pages --> Axios
    Pages <--> SocketClient

    Axios -- HTTP REST Calls --> Server
    SocketClient <--> SocketServer

    Server --> RateLimiter
    RateLimiter -- Check IP --> Redis
    Server --> AuthMiddleware
    Server --> MulterMiddleware
    AuthMiddleware --> Controllers
    MulterMiddleware --> Controllers

    Controllers <--> MongoDB
    Controllers <--> Cloudinary
    Controllers <--> EscrowGateway
```

---

## 2. Environment & System Initialization (Basic)

### **A. Backend Bootstrapping**
When the server starts (`npm run dev` or `node server/index.js`), the execution follows this order:

1. **Environment Configuration (`.env`):** Loads `PORT`, `MONGO_URL`, `JWT_SECRET`, `REDIS_URL`, and `CLOUDINARY_*` keys via `dotenv`.
2. **Database Connection (`server/src/config/db.js`):**
   - Connects to MongoDB Atlas using `mongoose.connect()`.
   - Parses Atlas replica sets and custom database names (`rentra_db`).
3. **Middleware Initialization (`app.js`):**
   - `helmet()` for HTTP security headers.
   - `cors()` to allow requests from `http://localhost:5173`.
   - `express.json({ limit: '10mb' })` for parsing JSON payloads.
   - Custom `rateLimiter` backed by Redis to restrict excessive API calls.
4. **Route Mounting (`app.js`):**
   - `/api/auth` -> `auth.routes.js`
   - `/api/equipment` -> `equipment.routes.js`
   - `/api/bookings` -> `booking.routes.js`
   - `/api/escrow` -> `escrow.routes.js`
   - `/api/admin` -> `admin.routes.js`
   - `/api/upload` -> Multer + Cloudinary direct upload endpoint.
5. **HTTP & WebSocket Server Start (`index.js`):**
   - Creates HTTP server and attaches `socket.io` server listening on `PORT` (3000).

---

### **B. Frontend Bootstrapping & Provider Tree**
When the user visits the app in a browser:

1. **Entry Point (`client/index.html`):** Loads Vite script `/src/main.jsx`.
2. **React DOM Mounting (`main.jsx`):** Mounts React onto `#root` wrapped in `<BrowserRouter>`.
3. **Global Context Hierarchy (`App.jsx`):** Context providers wrap the application in a specific nested order to ensure state accessibility across all pages:

```mermaid
graph TD
    App["App.jsx"] --> AuthP["AuthProvider"]
    AuthP --> SocketP["SocketProvider"]
    SocketP --> AdminP["AdminProvider"]
    AdminP --> OwnerP["OwnerProvider"]
    OwnerP --> CustP["CustomerProvider"]
    CustP --> Routes["AppRoutes"]
```

- **`AuthProvider`**: Manages current user profile, JWT token in `localStorage`, and login/logout methods.
- **`SocketProvider`**: Establishes live WebSocket connections when authenticated.
- **`AdminProvider`**: Aggregates system-wide users, equipment, bookings, and business profiles for administrative monitoring.
- **`OwnerProvider`**: Synchronizes equipment owned by the logged-in owner and incoming rental requests.
- **`CustomerProvider`**: Manages browse filters, customer active rentals, and wishlist items.

---

## 3. Authentication & Security Lifecycle (Basic to Intermediate)

### **A. User Registration & Password Hashing**
1. User fills out registration form (`Register.jsx`).
2. Client calls `authService.register({ name, email, password, role })`.
3. Backend controller (`auth.controller.js`):
   - Checks if user exists via `User.findOne({ email })`.
   - Hashes password using `bcryptjs` (`bcrypt.hash(password, 10)`).
   - Saves new `User` document in MongoDB.

### **B. JWT Token Generation & Client Storage**
1. On login (`POST /api/auth/login`), backend validates credentials with `bcrypt.compare()`.
2. Generates JSON Web Token (JWT) containing `{ id: user._id, role: user.role }` signed with `JWT_SECRET`.
3. Returns user JSON object and `token` string.
4. Client receives response, stores token in `localStorage.setItem('rentra_token', token)`, and updates `AuthContext` user state.

### **C. Axios Interceptors & Bearer Authentication**
All outgoing API requests automatically attach the stored token:

```javascript
// client/src/services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rentra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **D. Role-Based Access Control (RBAC)**
Protected backend routes execute `authenticateToken` middleware:
1. Extracts Bearer token from `Authorization` header.
2. Verifies token signature using `jwt.verify(token, JWT_SECRET)`.
3. Attaches decoded payload to `req.user`.
4. Route handlers verify role requirements (e.g., `req.user.role === 'admin'`).

---

## 4. Core Equipment Management & Payload Sanitization (Intermediate)

### **A. Location Address vs. GeoJSON Point Mapping**
MongoDB Equipment documents use two location formats:
1. `locationAddress` (String): Human-readable address (e.g., `"Houston, TX"`).
2. `location` (GeoJSON Subdocument): Point object for spatial querying (`{ type: "Point", coordinates: [-97.74, 30.26] }`).

**Payload Mapping:** When an owner creates or updates equipment (`AddEquipment.jsx` / `EditEquipment.jsx`), the string input is sanitized before sending to avoid breaking MongoDB 2dsphere index validation:

```javascript
// Map form 'location' string to 'locationAddress' property
const { location, ...restData } = formData;
await api.put(`/equipment/${id}`, {
  ...restData,
  locationAddress: location,
  pricePerDay: Number(formData.pricePerDay),
});
```

### **B. Category Standardization Across Roles**
Machinery categories are synchronized between Owner forms (`AddEquipment`, `EditEquipment`) and Customer browse filters (`BrowseEquipment`):
- Categories list: `['Earthmoving', 'Material Handling', 'Road Construction', 'Hauling', 'Lifting Equipment', 'Compaction', 'Construction', 'Agriculture', 'Industrial', 'Logistics', 'Power & Energy', 'Mining']`.

---

## 5. Advanced Workflows & Execution Pipelines

### **A. Cloudinary CDN Image Upload Pipeline (Multer + In-Memory Base64)**
Allows equipment owners to upload raw image files directly without writing temporary files to disk.

```mermaid
sequenceDiagram
    participant User as Owner Browser
    participant React as AddEquipment.jsx
    participant Express as Backend Express API
    participant Multer as Multer Memory Storage
    participant Cloudinary as Cloudinary SDK
    participant MongoDB as MongoDB Atlas
    
    User->>React: Selects image file(s)
    User->>React: Clicks "Add Equipment"
    React->>React: Constructs FormData payload
    React->>Express: POST /api/upload (multipart/form-data)
    Express->>Multer: upload.single('file') parses file into req.file.buffer
    Express->>Express: Converts buffer to base64 Data URI
    Express->>Cloudinary: uploader.upload(dataURI, { folder: 'rentra_equipment' })
    Cloudinary-->>Express: Returns result containing secure_url
    Express-->>React: Returns JSON { url: "https://res.cloudinary.com/..." }
    React->>Express: POST /api/equipment { ...formData, image: secure_url }
    Express->>MongoDB: Equipment.create()
    MongoDB-->>Express: Saved Document
    Express-->>React: 201 Created Response
```

---

### **B. Booking & Escrow Payment Lifecycle (Stripe / Razorpay)**
Ensures security deposits are securely held in escrow until rental completion.

```mermaid
sequenceDiagram
    participant Customer as Customer
    participant UI as RentModal / DepositPayment
    participant OwnerUI as Owner Dashboard
    participant Backend as Express API
    participant DB as MongoDB Atlas
    participant Gateway as Stripe / Razorpay
    
    Customer->>UI: Selects Dates & Requests Booking
    UI->>Backend: POST /api/bookings (Status: 'Pending Owner Approval')
    Backend->>DB: Save Booking
    
    OwnerUI->>Backend: PUT /api/bookings/:id/status (Status: 'APPROVED')
    Backend->>DB: Update Booking Status
    
    Customer->>UI: Opens Payment Screen
    UI->>Backend: POST /api/escrow/stripe/create-intent
    Backend->>Gateway: Create PaymentIntent (Deposit Amount)
    Gateway-->>Backend: Returns Client Secret
    Backend-->>UI: Returns Client Secret
    UI->>Gateway: Confirm Payment
    Gateway-->>UI: Payment Successful
    
    UI->>Backend: PUT /api/bookings/:id/status (Status: 'ACTIVE', depositStatus: 'Deposit Paid')
    Backend->>DB: Update Booking to Active Escrow
```

---

### **C. Real-time Communication (Socket.IO)**
Provides instantaneous updates when bookings change status or new requests arrive.

1. **Client Connection (`SocketContext.jsx`):**
   - Initializes `io(API_BASE_URL)` upon authentication.
   - Registers user socket ID.
2. **Server Listener (`server/index.js`):**
   - Manages connected sockets.
   - Emits `notification` events when booking status updates occur.
3. **Context Sync (`OwnerContext.jsx` / `CustomerContext.jsx`):**
   - Listens to `socket.on('notification', handleNotification)`.
   - Triggers automated re-fetching of bookings.

---

### **D. Owner State & MongoDB Synchronization (`refreshData`)**
Solves stale state issues by synchronizing React Context state with live MongoDB records immediately following mutations.

```mermaid
sequenceDiagram
    participant Component as EditEquipment.jsx
    participant API as Axios API Client
    participant Server as Express Server
    participant DB as MongoDB Atlas
    participant OwnerContext as OwnerContext.jsx
    
    Component->>API: api.put('/equipment/:id', updatedFields)
    API->>Server: PUT /api/equipment/:id
    Server->>DB: Equipment.findByIdAndUpdate()
    DB-->>Server: Updated Document
    Server-->>API: 200 OK Response
    API-->>Component: Promise Resolved
    
    Component->>OwnerContext: await refreshData()
    OwnerContext->>API: equipmentService.getAll() & bookingService.getAll()
    API->>Server: GET /api/equipment & GET /api/bookings
    Server->>DB: Fetch fresh collections
    DB-->>Server: Documents
    Server-->>API: Fresh Data Arrays
    API-->>OwnerContext: Mapped Data
    OwnerContext->>OwnerContext: setEquipmentList(freshData)
    OwnerContext-->>Component: Re-renders UI with updated live state
```

---

### **E. Admin Live Aggregation, Business Verification & Status Badges**
1. **Data Aggregation (`AdminContext.jsx`):**
   - Uses `Promise.all` across `adminService.getStats()`, `adminService.getBusinesses()`, `adminService.getUsers()`, and `adminService.getBookings()`.
   - Populates relational references (e.g., `ownerId` -> `name`, `email`, `phone`).
2. **Business Profile Verification:**
   - Admin reviews submitted documents (e.g., business licenses).
   - Executes `PUT /api/admin/businesses/:id/verify` to switch status between `Pending`, `Approved`, or `Rejected`.
3. **Dynamic Status Badges (`StatusBadge.jsx`):**
   - Normalizes backend status strings (e.g., `ACTIVE`, `APPROVED`, `Pending Owner Approval`, `CANCELLED`) case-insensitively.
   - Renders color-coded UI badges (Emerald for Active/Approved, Amber for Pending, Rose for Rejected/Blocked, Slate for Cancelled).

---

## 6. Error Handling & System Resiliency

1. **Backend Error Middleware (`errorMiddleware.js`):**
   - Catches unhandled controller errors.
   - Formats error responses to `{ error: message, details: ... }`.
2. **Frontend UI State Separation:**
   - Forms (such as `EditEquipment.jsx`) maintain distinct `message` (success banner) and `error` (error banner) state hooks to prevent error text from rendering inside success styling.
3. **Database Fallbacks:**
   - Mongoose schemas provide fallback defaults for missing image URLs, location coordinates, and rating values.
4. **Rate Limiting:**
   - Upstash Redis tracks request rates per IP address to safeguard against Denial of Service (DoS) attempts.
