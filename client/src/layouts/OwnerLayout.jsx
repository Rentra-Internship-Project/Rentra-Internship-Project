import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerNavbar from '../components/owner/OwnerNavbar';
import { OwnerProvider } from '../context/OwnerContext';

const OwnerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <OwnerProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        {/* Sidebar Navigation */}
        <OwnerSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all">
          {/* Top Navbar */}
          <OwnerNavbar setMobileOpen={setMobileOpen} />

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </OwnerProvider>
  );
};

export default OwnerLayout;
