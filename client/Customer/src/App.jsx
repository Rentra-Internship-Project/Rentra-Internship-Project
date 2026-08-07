import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import Dashboard from './pages/customer/Dashboard';
import BrowseEquipment from './pages/customer/BrowseEquipment';
import EquipmentDetails from './pages/customer/EquipmentDetails';
import BookingSummary from './pages/customer/BookingSummary';
import DepositPayment from './pages/customer/DepositPayment';
import PaymentSuccess from './pages/customer/PaymentSuccess';
import Wishlist from './pages/customer/Wishlist';
import Bookings from './pages/customer/Bookings';
import BookingDetails from './pages/customer/BookingDetails';
import Profile from './pages/customer/Profile';
import Notifications from './pages/customer/Notifications';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="browse-equipment" element={<BrowseEquipment />} />
          <Route path="equipment/:id" element={<EquipmentDetails />} />
          <Route path="booking-summary/:id" element={<BookingSummary />} />
          <Route path="payment/:id" element={<DepositPayment />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
        </Route>
        <Route path="/" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
