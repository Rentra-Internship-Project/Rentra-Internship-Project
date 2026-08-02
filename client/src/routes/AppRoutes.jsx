import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import OwnerRoutes from './OwnerRoutes';
import CustomerRoutes from './CustomerRoutes';
import LoginPage from '../pages/public/Login';
import RegisterPage from '../pages/public/Register';
import LandingPage from '../pages/public/Landing';
import OAuthCallback from '../pages/public/OAuthCallback';
import HomePage from '../pages/public/Home'; // Fallback if needed somewhere else
import TermsPage from '../pages/public/Terms';
import PrivacyPage from '../pages/public/Privacy';
import ContactPage from '../pages/public/Contact';
import NotFound from '../pages/public/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/oauth-callback" element={<OAuthCallback />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/contact" element={<ContactPage />} />
    {AdminRoutes()}
    {OwnerRoutes()}
    {CustomerRoutes()}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
