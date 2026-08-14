import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerNavbar from '../components/owner/OwnerNavbar';
import { OwnerProvider, useOwner } from '../context/OwnerContext';

const BusinessGuard = () => {
  const { business, businessLoading } = useOwner();
  const location = useLocation();

  if (businessLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no business exists, strictly force to register-business
  if (!business) {
    if (location.pathname !== '/owner/register-business') {
      return <Navigate to="/owner/register-business" replace />;
    }
  } 
  // If business exists but not approved, strictly force to business-status
  else if (business.status === 'Pending' || business.status === 'Rejected') {
    if (location.pathname !== '/owner/business-status' && location.pathname !== '/owner/register-business') {
      return <Navigate to="/owner/business-status" replace />;
    }
  }
  // If business is approved and user is trying to access registration, redirect to dashboard
  else if (business.status === 'Approved') {
    if (location.pathname === '/owner/register-business' || location.pathname === '/owner/business-status') {
      return <Navigate to="/owner/dashboard" replace />;
    }
  }

  return <Outlet />;
};

const OwnerLayoutContent = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { business } = useOwner();
  const location = useLocation();

  // Hide sidebar/navbar if on registration or status pages
  const isSetupPage = location.pathname === '/owner/register-business' || location.pathname === '/owner/business-status';

  if (isSetupPage) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <BusinessGuard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <OwnerSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all">
        <OwnerNavbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <BusinessGuard />
        </main>
      </div>
    </div>
  );
};

const OwnerLayout = () => {
  return (
    <OwnerProvider>
      <OwnerLayoutContent />
    </OwnerProvider>
  );
};

export default OwnerLayout;
