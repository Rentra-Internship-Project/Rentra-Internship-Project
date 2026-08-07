import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../components/customer/CustomerSidebar';
import CustomerNavbar from '../components/customer/CustomerNavbar';
import { CustomerProvider } from '../context/CustomerContext';

const CustomerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CustomerProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        {/* Fixed Sidebar Navigation */}
        <CustomerSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all">
          {/* Sticky Top Navbar */}
          <CustomerNavbar setMobileOpen={setMobileOpen} />

          {/* Main Page Content */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </CustomerProvider>
  );
};

export default CustomerLayout;
