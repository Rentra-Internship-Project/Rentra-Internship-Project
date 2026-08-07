import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import OwnerRoutes from './OwnerRoutes';
import CustomerRoutes from './CustomerRoutes';
import LoginPage from '../pages/public/Login';
import RegisterPage from '../pages/public/Register';
import HomePage from '../pages/public/Home';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    {AdminRoutes()}
    {OwnerRoutes()}
    {CustomerRoutes()}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
