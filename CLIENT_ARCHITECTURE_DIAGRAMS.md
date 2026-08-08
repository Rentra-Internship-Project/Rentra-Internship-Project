# Rentra Client Architecture — Visual Diagrams

> Supplementary visual documentation for the client-side architecture

---

## 🏗️ Complete System Architecture

```mermaid
flowchart TB
    subgraph "Client Layer (Browser)"
        direction TB
        
        subgraph "Admin Portal [:3000]"
            A1[main.jsx] --> A2[App.jsx]
            A2 --> A3[BrowserRouter]
            A3 --> A4[AdminRoutes]
            A4 --> A5[AdminLayout]
            A5 --> A6[AdminSidebar]
            A5 --> A7[AdminNavbar]
            A5 --> A8[Outlet → Pages]
            A8 --> A9[Dashboard]
            A8 --> A10[Users]
            A8 --> A11[Businesses]
            A8 --> A12[Equipment]
            A8 --> A13[Categories]
            A8 --> A14[Bookings]
            A8 --> A15[Profile]
            
            A9 --> AC[AdminContext]
            A10 --> AC
            A11 --> AC
            A12 --> AC
            A13 --> AC
            A14 --> AC
            A15 --> AC
            
            AC --> AD[mockData.js]
        end
        
        subgraph "Customer Portal [:3001]"
            B1[main.jsx] --> B2[App.jsx]
            B2 --> B3[BrowserRouter + Routes]
            B3 --> B4[CustomerLayout]
            B4 --> B5[CustomerSidebar]
            B4 --> B6[CustomerNavbar]
            B4 --> B7[Outlet → Pages]
            
            B7 --> B8[Dashboard]
            B7 --> B9[BrowseEquipment]
            B7 --> B10[EquipmentDetails]
            B7 --> B11[BookingSummary]
            B7 --> B12[DepositPayment]
            B7 --> B13[PaymentSuccess]
            B7 --> B14[Wishlist]
            B7 --> B15[Bookings]
            B7 --> B16[BookingDetails]
            B7 --> B17[Profile]
            B7 --> B18[Notifications]
            
            B4 --> CC[CustomerContext]
            CC --> CD[customerMockData.js]
        end
        
        subgraph "Owner Portal [:3002]"
            C1[main.jsx] --> C2[App.jsx]
            C2 --> C3[BrowserRouter]
            C3 --> C4[AuthProvider]
            C4 --> C5[Routes]
            
            C5 --> C6[/login → GuestRoute → LoginPage]
            C5 --> C7[/owner/* → ProtectedRoute → OwnerLayout]
            
            C7 --> C8[OwnerSidebar]
            C7 --> C9[OwnerNavbar]
            C7 --> C10[Outlet → Pages]
            
            C10 --> C11[Dashboard]
            C10 --> C12[RegisterBusiness]
            C10 --> C13[BusinessStatus]
            C10 --> C14[Equipment]
            C10 --> C15[AddEquipment]
            C10 --> C16[EditEquipment]
            C10 --> C17[Bookings]
            C10 --> C18[Earnings]
            C10 --> C19[Profile]
            
            C4 --> CO[AuthContext]
            CO --> CP[ownerMockData.js]
        end
    end
    
    subgraph "Shared Design System"
        DS1[Tailwind CSS 4]
        DS2[Framer Motion 12]
        DS3[React Icons - Feather]
        DS4[CSS Variables]
        DS5[Component Patterns]
    end
    
    A5 --> DS1
    A5 --> DS2
    A5 --> DS3
    A5 --> DS4
    B4 --> DS1
    B4 --> DS2
    B4 --> DS3
    B4 --> DS4
    C7 --> DS1
    C7 --> DS2
    C7 --> DS3
    C7 --> DS4
```

---

## 🔄 Booking Flow — Customer Portal

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer
    participant UI as Customer Portal
    participant CX as CustomerContext
    participant M as Mock Data
    participant O as Owner Portal
    
    C->>UI: Browse Equipment
    UI->>CX: equipmentList
    CX-->>UI: mockEquipment[]
    
    C->>UI: Click "Book Now" on Equipment
    UI->>UI: Navigate /customer/booking-summary/:id
    UI->>CX: prepareBookingSummary(bookingData)
    CX->>CX: Create draftBooking with ID, dates, pricing
    CX-->>UI: bookingSummary
    
    C->>UI: Review & Confirm Deposit
    UI->>CX: confirmDepositPayment(bookingId, paymentMethod)
    CX->>CX: Create booking with status "Pending Owner Approval"
    CX->>CX: depositStatus = "Deposit Paid"
    CX->>CX: Add to bookings[], clear draftBooking
    CX->>CX: Create notification
    CX-->>UI: createdBooking
    
    UI->>C: Show PaymentSuccess page
    
    Note over O: Owner receives notification
    O->>O: Accept/Reject booking
    O->>CX: (via shared backend in future)
    CX->>CX: Update booking status
    CX->>CX: Create notification for customer
    
    C->>UI: Pay Remaining Balance
    UI->>CX: payRemainingBalance(bookingId, paymentMethod)
    CX->>CX: status = "Rental Active"
    CX->>CX: remainingBalance = 0
    CX->>CX: Update timeline
    CX->>CX: Create notification
    
    Note over C,O: Rental period
    
    C->>UI: Rental Completes
    CX->>CX: refundStatus = "Deposit Refunded"
    CX->>CX: Create notification
```

---

## 🔐 Owner Authentication Flow

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated: App Load
    
    Unauthenticated --> LoginPage: Navigate to /login
    LoginPage --> Validating: Submit credentials
    
    Validating --> Authenticated: Success (owner@rentra.com / owner123)
    Validating --> LoginPage: Failure (show error)
    
    Authenticated --> OwnerDashboard: Redirect to /owner/dashboard
    Authenticated --> ProtectedRoute: Any /owner/* route
    
    ProtectedRoute --> OwnerLayout: isAuthenticated = true
    ProtectedRoute --> LoginPage: isAuthenticated = false (redirect)
    
    OwnerLayout --> Dashboard: /
    OwnerLayout --> RegisterBusiness: /register-business
    OwnerLayout --> BusinessStatus: /business-status
    OwnerLayout --> Equipment: /equipment
    OwnerLayout --> AddEquipment: /add-equipment
    OwnerLayout --> EditEquipment: /edit-equipment/:id
    OwnerLayout --> Bookings: /bookings
    OwnerLayout --> Earnings: /earnings
    OwnerLayout --> Profile: /profile
    
    Authenticated --> Unauthenticated: Logout clicked
    Unauthenticated --> LoginPage: Redirect to /login
    
    note right of Authenticated
        AuthContext provides:
        - user object
        - isAuthenticated boolean
        - login() function
        - logout() function
    end note
```

---

## 🧩 Component Composition — Dashboard Pages

### Admin Dashboard Component Tree

```mermaid
graph TD
    AD[Dashboard] --> WB[Welcome Banner]
    AD --> SC[StatsCard Grid ×4]
    AD --> PA[Pending Actions ×2]
    AD --> QA[QuickActions]
    AD --> RA[RecentActivity]
    
    SC --> SC1[Total Users]
    SC --> SC2[Total Businesses]
    SC --> SC3[Total Equipment]
    SC --> SC4[Total Bookings]
    
    PA --> PA1[Pending Business Verifications]
    PA --> PA2[Pending Equipment Approvals]
    
    QA --> QA1[Button: Review Users]
    QA --> QA2[Button: Manage Businesses]
    QA --> QA3[Button: Moderate Equipment]
    QA --> QA4[Button: View Bookings]
    
    RA --> RAI[ActivityItem ×5]
```

### Customer Dashboard Component Tree

```mermaid
graph TD
    CD[Dashboard] --> WB[Welcome Banner + Actions]
    CD --> SC[StatsCard Grid ×4]
    CD --> QAB[Quick Actions Bar ×4]
    CD --> MAIN[Main Grid]
    
    SC --> SC1[Total Bookings]
    SC --> SC2[Active Rentals]
    SC --> SC3[Wishlist Items]
    SC --> SC4[Notifications]
    
    QAB --> QAB1[Browse Equipment]
    QAB --> QAB2[View Bookings]
    QAB --> QAB3[Saved Wishlist]
    QAB --> QAB4[Update Profile]
    
    MAIN --> RB[Recent Bookings ×3]
    MAIN --> RN[Recent Notifications ×3]
    
    CD --> REC[Recommended Equipment ×4]
    
    REC --> REC1[EquipmentCard]
    REC --> REC2[EquipmentCard]
    REC --> REC3[EquipmentCard]
    REC --> REC4[EquipmentCard]
```

### Owner Dashboard Component Tree

```mermaid
graph TD
    OD[Dashboard] --> WB[Welcome Banner]
    OD --> SC[StatsCard Grid ×4]
    OD --> BV[Business Verification Banner]
    OD --> QA[Quick Actions ×4]
    OD --> RB[Recent Booking Requests ×3]
    OD --> RE[Recent Equipment Listings ×3]
    
    SC --> SC1[Total Equipment]
    SC --> SC2[Active Bookings]
    SC --> SC3[Pending Requests]
    SC --> SC4[Monthly Earnings]
    
    QA --> QA1[Add Equipment]
    QA --> QA2[Manage Equipment]
    QA --> QA3[View Bookings]
    QA --> QA4[View Earnings]
    
    RB --> RBC[BookingCard ×3]
    RE --> REC[EquipmentRow ×3]
```

---

## 📱 Responsive Breakpoint Behavior

```mermaid
graph LR
    subgraph "Mobile (< 768px)"
        M1[Hamburger Menu]
        M2[Drawer Sidebar]
        M3[Stacked Cards]
        M4[Hidden Search]
        M5[Condensed Navbar]
    end
    
    subgraph "Tablet (768px - 1024px)"
        T1[Hamburger Menu]
        T2[Drawer Sidebar]
        T3[2-col Grid]
        T4[Inline Search]
        T5[Full Navbar]
    end
    
    subgraph "Desktop (> 1024px)"
        D1[Fixed Sidebar]
        D2[Always Visible]
        D3[4-col Grid]
        D4[Full Search Bar]
        D5[Full Navbar + Avatar]
    end
    
    M1 --> T1 --> D1
    M2 --> T2 --> D2
    M3 --> T3 --> D3
    M4 --> T4 --> D4
    M5 --> T5 --> D5
```

### Breakpoint Implementation (Tailwind)

```css
/* Sidebar */
.hidden.md:block        /* Desktop: visible */
.md:hidden              /* Mobile/Tablet: hidden */

/* Grid Layouts */
grid-cols-1             /* Mobile: 1 column */
sm:grid-cols-2          /* Small: 2 columns */
lg:grid-cols-4          /* Large: 4 columns */

/* Search Bar */
.hidden.lg:block        /* Desktop only */

/* Navbar Text */
.hidden.sm:block        /* Tablet+ */
.hidden.xl:block        /* XL+ */

/* Padding */
p-4.md:p-8              /* Mobile 16px, Desktop 32px */
```

---

## 🎬 Animation Choreography

```mermaid
timeline
    title Page Load Animation Sequence
    
    0ms : Page Mount
    50ms : Layout Paint (no motion)
    100ms : Dashboard Container animate in (opacity 0→1, y 12→0)
    150ms : Stats Cards stagger in (spring, staggerChildren: 0.05)
    200ms : Pending Actions Banner animate in
    250ms : Quick Actions animate in
    300ms : Recent Activity animate in
    350ms : Recommended Equipment cards stagger in
    400ms : All interactive (hover/tap ready)
```

### Framer Motion Variants Used

```javascript
// Page container
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

// Staggered children
const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.05 }
  }
};

// Card hover
const cardHover = {
  whileHover: { y: -3 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

// Button press
const buttonTap = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.98 }
};

// Modal/drawer
const drawerVariants = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { type: 'spring', damping: 25, stiffness: 200 }
};

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};
```

---

## 📊 Data Relationships

```mermaid
erDiagram
    %% Admin Domain
    ADMIN_USER ||--o{ MOCK_USER : manages
    ADMIN_BUSINESS ||--o{ MOCK_BUSINESS : verifies
    ADMIN_EQUIPMENT ||--o{ MOCK_EQUIPMENT : moderates
    ADMIN_CATEGORY ||--o{ MOCK_CATEGORY : manages
    ADMIN_BOOKING ||--o{ MOCK_BOOKING : monitors
    
    %% Customer Domain
    CUSTOMER_PROFILE ||--o{ CUSTOMER_BOOKING : makes
    CUSTOMER_PROFILE }|--o{ CUSTOMER_WISHLIST : saves
    CUSTOMER_EQUIPMENT ||--o{ CUSTOMER_BOOKING : books
    CUSTOMER_NOTIFICATION }|--o{ CUSTOMER_PROFILE : receives
    
    %% Owner Domain
    OWNER_PROFILE ||--o{ OWNER_EQUIPMENT : lists
    OWNER_EQUIPMENT ||--o{ OWNER_BOOKING : receives
    OWNER_BOOKING }|--o{ OWNER_EARNINGS : generates
    OWNER_NOTIFICATION }|--o{ OWNER_PROFILE : receives
    OWNER_BUSINESS_STATUS ||--|| OWNER_PROFILE : belongs_to
    
    %% Cross-Domain (Future API)
    ADMIN_BUSINESS }|--|| OWNER_PROFILE : approves
    ADMIN_EQUIPMENT }|--|| OWNER_EQUIPMENT : approves
    CUSTOMER_BOOKING }|--|| OWNER_BOOKING : matches
```

---

## 🔀 State Synchronization (Future)

```mermaid
sequenceDiagram
    participant C as Customer Portal
    participant API as Backend API
    participant O as Owner Portal
    participant A as Admin Portal
    
    Note over C,A: Current: Independent mock data (no sync)
    
    Note over C,O: Future: Real-time sync via API
    
    C->>API: POST /bookings (create booking)
    API->>API: Validate, create record
    API->>O: WebSocket: new booking request
    API->>C: HTTP 201 + booking object
    C->>C: Update local state (optimistic)
    
    O->>API: PATCH /bookings/:id (accept)
    API->>API: Update status
    API->>C: WebSocket: booking accepted
    API->>O: HTTP 200 + updated booking
    
    Note over C,O: Both portals receive real-time updates
    Note over A: Admin sees all via polling or WebSocket
```

---

## 📦 Bundle Analysis (Estimated)

```mermaid
pie title Estimated Bundle Sizes (gzipped)
    "React + ReactDOM" : 45
    "React Router" : 15
    "Framer Motion" : 20
    "React Icons" : 8
    "Tailwind Runtime" : 2
    "App Code" : 10
```

### Optimization Opportunities

| Technique | Impact | Status |
|-----------|--------|--------|
| Code Splitting (React.lazy) | -30% initial JS | ⏳ Planned |
| Tree Shaking Icons | -50% icon bundle | ✅ Auto (ESM) |
| Dynamic Import Routes | -40% route chunks | ⏳ Planned |
| Compression (gzip/brotli) | -70% transfer | ✅ Server config |
| Cache Headers | Repeat visits ~0 | ✅ Nginx/Vercel |
| Preload Critical CSS | Faster FCP | ⏳ Planned |

---

*Visual documentation generated from codebase analysis*