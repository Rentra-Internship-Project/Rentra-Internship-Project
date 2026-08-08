import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Businesses from '../pages/admin/Businesses';
import Equipment from '../pages/admin/Equipment';
import Categories from '../pages/admin/Categories';
import Bookings from '../pages/admin/Bookings';
import Profile from '../pages/admin/Profile';

const AdminRoutes = () => (
  <>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="businesses" element={<Businesses />} />
      <Route path="equipment" element={<Equipment />} />
      <Route path="categories" element={<Categories />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
  </>
);

export default AdminRoutes;
