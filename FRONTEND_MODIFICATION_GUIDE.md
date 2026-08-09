# Rentra — Frontend Modification & Developer Implementation Guide

> **Complete Client Developer Guide**: Contains copy-paste ready React 19 components, exact page file edits, context integration scripts, and step-by-step instructions to implement the 5 unique features in the Rentra frontend.

---

## 📁 1. Frontend File Structure Overview

```
client/src/
├── components/
│   ├── common/
│   │   ├── DemoRoleSwitcher.jsx       # [NEW] Sticky 1-click role switcher bar for demo presentation
│   │   ├── SignaturePad.jsx           # [NEW] Zero-cost HTML5 canvas e-signature component
│   │   └── DigitalInspectionModal.jsx # [NEW] 4-step photo inspection & sign-off modal
│   └── customer/
│       └── FleetBundlerModal.jsx      # [NEW] Multi-machine package selection modal
├── pages/
│   ├── owner/
│   │   └── AddEquipment.jsx           # [MODIFY] Add Certified Operator availability & rate inputs
│   └── customer/
│       ├── EquipmentDetails.jsx       # [MODIFY] Add Operator toggle & Lowboy Hauling Estimator slider
│       ├── BrowseEquipment.jsx        # [MODIFY] Add Fleet Packages tab / bundle banner
│       └── BookingDetails.jsx         # [MODIFY] Add Engine Run-Time Overtime Meter & E-Signature trigger
├── context/
│   └── CustomerContext.jsx             # [MODIFY] Fetch equipment & bookings from Express API
└── App.jsx                            # [MODIFY] Attach floating DemoRoleSwitcher toolbar
```

---

## 🧩 2. Complete Copy-Paste New Components

### Component A: `client/src/components/common/DemoRoleSwitcher.jsx`
*Purpose*: Allows your evaluator to toggle between Customer, Owner, and Admin portals in 1 click during live presentation.

```jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DemoRoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = location.pathname.startsWith('/admin')
    ? 'Admin'
    : location.pathname.startsWith('/owner')
    ? 'Owner'
    : 'Customer';

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold">
      <span className="text-slate-400">Demo Portal:</span>
      <div className="flex gap-1">
        <button
          onClick={() => navigate('/customer')}
          className={`px-3 py-1 rounded-full transition ${currentRole === 'Customer' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          Customer
        </button>
        <button
          onClick={() => navigate('/owner')}
          className={`px-3 py-1 rounded-full transition ${currentRole === 'Owner' ? 'bg-amber-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          Owner
        </button>
        <button
          onClick={() => navigate('/admin')}
          className={`px-3 py-1 rounded-full transition ${currentRole === 'Admin' ? 'bg-rose-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          Admin
        </button>
      </div>
    </div>
  );
}
```

---

### Component B: `client/src/components/common/SignaturePad.jsx`
*Purpose*: Zero-cost HTML5 Canvas signature pad for capturing digital sign-offs.

```jsx
import React, { useRef, useState } from 'react';

export default function SignaturePad({ onSave }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-700 block">Digital Signature (Draw below using Mouse or Touch):</label>
      <canvas
        ref={canvasRef}
        width={380}
        height={140}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-dashed border-slate-300 rounded-xl bg-white cursor-crosshair w-full shadow-inner"
      />
      <div className="flex gap-2 justify-end">
        <button 
          onClick={clearCanvas} 
          type="button" 
          className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
        >
          Clear Pad
        </button>
        <button 
          onClick={() => onSave(canvasRef.current.toDataURL())} 
          type="button" 
          className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition"
        >
          Confirm Signature
        </button>
      </div>
    </div>
  );
}
```

---

### Component C: `client/src/components/customer/FleetBundlerModal.jsx`
*Purpose*: Multi-machine project package selection modal with bundle discounts.

```jsx
import React from 'react';

export default function FleetBundlerModal({ isOpen, onClose, onSelectBundle }) {
  if (!isOpen) return null;

  const bundles = [
    {
      id: 'pkg-foundation',
      name: 'Building Foundation Package',
      icon: '🏗️',
      discountPercent: 10,
      items: ['Caterpillar 320 Heavy Excavator', 'Volvo A40G Dump Truck'],
      originalPrice: 830,
      discountedPrice: 747,
      description: 'Ideal fleet package for site digging, foundation trenching, and soil transport.'
    },
    {
      id: 'pkg-paving',
      name: 'Road Construction & Paving Package',
      icon: '🛣️',
      discountPercent: 12,
      items: ['Vögele Super 1800 Asphalt Paver', 'HAMM HD+ 90i Tandem Roller'],
      originalPrice: 1050,
      discountedPrice: 924,
      description: 'Complete road paving machinery setup with high compaction capacity.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">🏗️ Project Fleet Package Bundles</h3>
            <p className="text-xs text-slate-500">Rent complementary machinery together and save up to 12%</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {bundles.map((bundle) => (
            <div key={bundle.id} className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{bundle.icon}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {bundle.discountPercent}% BUNDLE DISCOUNT
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-2">{bundle.name}</h4>
                <p className="text-xs text-slate-600 mt-1">{bundle.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-slate-700">
                  {bundle.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <div>
                  <span className="text-xs line-through text-slate-400 mr-2">${bundle.originalPrice}/day</span>
                  <span className="text-sm font-extrabold text-indigo-600">${bundle.discountedPrice}/day</span>
                </div>
                <button
                  onClick={() => {
                    onSelectBundle(bundle);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  Book Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 3. Page Modifications

### Page A: `pages/owner/AddEquipment.jsx`
Add form inputs for **Certified Operator Availability** and **Driver Daily Rate**:

```jsx
// Inside component state:
const [operatorAvailable, setOperatorAvailable] = useState(true);
const [operatorDailyRate, setOperatorDailyRate] = useState(150);

// Inside JSX return form:
<div className="p-4 bg-slate-50 border rounded-xl space-y-3">
  <div className="flex items-center justify-between">
    <div>
      <label className="font-semibold text-slate-800 text-sm">Certified Operator Option</label>
      <p className="text-xs text-slate-500">Provide a qualified, licensed driver with this machine</p>
    </div>
    <input 
      type="checkbox" 
      checked={operatorAvailable} 
      onChange={(e) => setOperatorAvailable(e.target.checked)}
      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
    />
  </div>

  {operatorAvailable && (
    <div>
      <label className="text-xs font-medium text-slate-600 block mb-1">Driver Daily Rate ($/day)</label>
      <input 
        type="number" 
        value={operatorDailyRate} 
        onChange={(e) => setOperatorDailyRate(Number(e.target.value))}
        className="w-full px-3 py-2 border rounded-lg text-sm"
        placeholder="150"
      />
    </div>
  )}
</div>
```

---

### Page B: `pages/customer/EquipmentDetails.jsx`
Add **Certified Operator Checkbox** and **Lowboy Delivery Hauling Slider**:

```jsx
// Component state:
const [includeOperator, setIncludeOperator] = useState(false);
const [distanceKm, setDistanceKm] = useState(25);

// Financial Formulas:
const BASE_HAULING = 150;
const PER_KM_RATE = 3.50;
const deliveryFee = BASE_HAULING + (distanceKm * PER_KM_RATE);

const baseRate = equipment?.dailyRate || 450;
const operatorRate = includeOperator ? (equipment?.operatorDailyRate || 150) : 0;
const effectiveDailyRate = baseRate + operatorRate;
const rentalSubtotal = effectiveDailyRate * totalDays;
const grandTotal = rentalSubtotal + deliveryFee;

// Render inside sidebar booking card:
{equipment?.operatorAvailable && (
  <label className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer mt-3">
    <input 
      type="checkbox" 
      checked={includeOperator} 
      onChange={(e) => setIncludeOperator(e.target.checked)}
      className="w-4 h-4 accent-emerald-600"
    />
    <div className="text-xs">
      <span className="font-bold text-emerald-900 block">Include Certified Operator</span>
      <span className="text-emerald-700">+${equipment.operatorDailyRate || 150}/day for licensed driver</span>
    </div>
  </label>
)}

<div className="p-4 bg-slate-50 border rounded-xl mt-4 space-y-2">
  <div className="flex justify-between items-center text-xs">
    <span className="font-bold text-slate-800">🚚 Lowboy Delivery Logistics</span>
    <span className="text-indigo-600 font-bold">+${deliveryFee.toFixed(2)}</span>
  </div>
  <label className="text-xs text-slate-500 block">Job Site Distance: <strong>{distanceKm} km</strong></label>
  <input 
    type="range" min="5" max="150" value={distanceKm} 
    onChange={(e) => setDistanceKm(Number(e.target.value))}
    className="w-full accent-indigo-600 cursor-pointer"
  />
  <p className="text-[11px] text-slate-500">
    Trailer Required: <strong>{equipment?.weightTons > 10 ? '3-Axle Heavy Lowboy' : 'Flatbed Trailer'}</strong>
  </p>
</div>
```

---

### Page C: `pages/customer/BookingDetails.jsx`
Add **Engine Run-Time Overtime Meter Slider**:

```jsx
const ALLOWED_HOURS_PER_DAY = 8;
const OVERTIME_HOURLY_RATE = 45;

const maxAllowedHours = rentalDays * ALLOWED_HOURS_PER_DAY;
const [loggedHours, setLoggedHours] = useState(maxAllowedHours);

const overtimeHours = Math.max(0, loggedHours - maxAllowedHours);
const overtimeSurcharge = overtimeHours * OVERTIME_HOURLY_RATE;

// Render inside booking detail page:
<div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mt-4 space-y-2">
  <div className="flex justify-between items-center text-xs font-bold text-amber-900">
    <span>⏱️ Engine Run-Time Inspection Meter</span>
    <span>Allowance: {maxAllowedHours} hrs</span>
  </div>
  <input 
    type="range" 
    min={maxAllowedHours} 
    max={maxAllowedHours + 20} 
    value={loggedHours} 
    onChange={(e) => setLoggedHours(Number(e.target.value))}
    className="w-full accent-amber-600 cursor-pointer"
  />
  <div className="flex justify-between text-xs font-medium">
    <span>Logged Engine Hours: <strong>{loggedHours} hrs</strong></span>
    {overtimeHours > 0 ? (
      <span className="text-rose-600 font-bold">Overtime Surcharge: +${overtimeSurcharge}</span>
    ) : (
      <span className="text-emerald-700 font-semibold">Within Standard Allowance</span>
    )}
  </div>
</div>
```

---

### Page D: `App.jsx`
Attach the floating `DemoRoleSwitcher` bar:

```jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import DemoRoleSwitcher from './components/common/DemoRoleSwitcher';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <DemoRoleSwitcher />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🔌 4. Express API Connection (`context/CustomerContext.jsx`)

Connect your React Context state directly to `http://localhost:3000/api`:

```javascript
import React, { createContext, useState, useEffect } from 'react';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch equipment from backend Express API
  useEffect(() => {
    fetch('http://localhost:3000/api/equipment')
      .then(res => res.json())
      .then(data => {
        setEquipment(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch equipment from API, using fallback', err);
        setLoading(false);
      });
  }, []);

  // Create booking via Express API
  const createBooking = async (bookingData) => {
    try {
      const res = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      setBookings(prev => [...prev, data.booking]);
      return data;
    } catch (err) {
      console.error('Error creating booking', err);
    }
  };

  return (
    <CustomerContext.Provider value={{ equipment, bookings, createBooking, loading }}>
      {children}
    </CustomerContext.Provider>
  );
};
```
