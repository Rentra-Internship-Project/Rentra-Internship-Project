import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './routes/ProtectedRoute';
import OwnerLayout from './layouts/OwnerLayout';
import LoginPage from './pages/public/Login';
import Dashboard from './pages/owner/Dashboard';
import RegisterBusiness from './pages/owner/RegisterBusiness';
import BusinessStatus from './pages/owner/BusinessStatus';
import Equipment from './pages/owner/Equipment';
import AddEquipment from './pages/owner/AddEquipment';
import EditEquipment from './pages/owner/EditEquipment';
import Bookings from './pages/owner/Bookings';
import Earnings from './pages/owner/Earnings';
import Profile from './pages/owner/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute>
                <OwnerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/owner/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="register-business" element={<RegisterBusiness />} />
            <Route path="business-status" element={<BusinessStatus />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="add-equipment" element={<AddEquipment />} />
            <Route path="edit-equipment/:id" element={<EditEquipment />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
