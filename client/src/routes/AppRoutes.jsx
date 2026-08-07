import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import OwnerRoutes from './OwnerRoutes';
import CustomerRoutes from './CustomerRoutes';
import LoginPage from '../pages/public/Login';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<Navigate to="/login" replace />} />
    {AdminRoutes()}
    {OwnerRoutes()}
    {CustomerRoutes()}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
