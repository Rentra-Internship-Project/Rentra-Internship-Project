import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import OwnerLayout from '../layouts/OwnerLayout';
import Dashboard from '../pages/owner/Dashboard';
import RegisterBusiness from '../pages/owner/RegisterBusiness';
import BusinessStatus from '../pages/owner/BusinessStatus';
import Equipment from '../pages/owner/Equipment';
import AddEquipment from '../pages/owner/AddEquipment';
import EditEquipment from '../pages/owner/EditEquipment';
import Bookings from '../pages/owner/Bookings';
import Earnings from '../pages/owner/Earnings';
import Profile from '../pages/owner/Profile';

const OwnerRoutes = () => (
  <>
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
  </>
);

export default OwnerRoutes;
